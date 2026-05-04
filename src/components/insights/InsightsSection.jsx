import { useMemo } from 'react';
import { subDays, format, parseISO, startOfMonth, addMonths } from 'date-fns';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { TrendingUp, TrendingDown, PiggyBank, ShoppingBag, Zap } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import { calculateBalanceForecast } from '../../utils/prediction';

const TODAY = new Date(2026, 3, 2);

function InsightCard({ icon: Icon, label, value, sub, valueColor = 'text-gray-900 dark:text-white', isSpecial = false }) {
    return (
        <div className={`
            bg-white dark:bg-gray-900 border rounded-2xl p-5 shadow-sm flex items-start gap-4 transition-all
            ${isSpecial ? 'border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/30 dark:bg-indigo-950/10' : 'border-gray-200 dark:border-gray-800'}
        `}>
            <div className={`p-3 rounded-xl shrink-0 ${isSpecial ? 'bg-indigo-100 dark:bg-indigo-900/50' : 'bg-gray-100 dark:bg-gray-800'}`}>
                <Icon size={20} className={isSpecial ? 'text-indigo-600 dark:text-indigo-400' : 'text-indigo-500'} />
            </div>
            <div className="min-w-0">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</p>
                <p className={`text-xl font-bold truncate ${valueColor}`}>{value}</p>
                {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sub}</p>}
            </div>
        </div>
    );
}

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    const isForecast = payload[0].payload.isForecast;
    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 shadow-lg text-sm space-y-1">
            <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1">
                {label} {isForecast && <span className="text-[10px] text-indigo-500 font-bold ml-1 uppercase">(Forecast)</span>}
            </p>
            {payload.map((p) => (
                <p key={p.name} style={{ color: p.fill }} className="font-medium">
                    {p.name}: ₹{(p.value / 1000).toFixed(1)}k
                </p>
            ))}
        </div>
    );
}

export default function InsightsSection({ transactions }) {
    const { topCategory, avgDailyExpense, savingsRate, monthlyData, forecast, nextMonthName } = useMemo(() => {
        const categoryTotals = {};
        transactions
            .filter((t) => t.type === 'expense')
            .forEach((t) => {
                categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
            });

        const topCategory = Object.entries(categoryTotals)
            .sort((a, b) => b[1] - a[1])[0] ?? ['N/A', 0];

        const cutoff = subDays(TODAY, 30);
        const last30Expenses = transactions
            .filter((t) => t.type === 'expense' && parseISO(t.date) >= cutoff)
            .reduce((sum, t) => sum + t.amount, 0);

        const avgDailyExpense = last30Expenses / 30;

        const totalIncome = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
        const totalExpenses = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
        const currentBalance = totalIncome - totalExpenses;
        const savingsRate = totalIncome > 0
            ? ((totalIncome - totalExpenses) / totalIncome) * 100
            : 0;

        const months = Array.from({ length: 4 }, (_, i) => {
            const d = new Date(TODAY.getFullYear(), TODAY.getMonth() - (3 - i), 1);
            return {
                key: format(d, 'yyyy-MM'),
                label: format(d, 'MMM yyyy'),
                income: 0,
                expense: 0,
            };
        });

        transactions.forEach((t) => {
            const key = format(startOfMonth(parseISO(t.date)), 'yyyy-MM');
            const m = months.find((mn) => mn.key === key);
            if (!m) return;
            if (t.type === 'income') m.income += t.amount;
            if (t.type === 'expense') m.expense += t.amount;
        });

        const monthlyData = months.map((m) => ({
            name: m.label,
            Income: Math.round(m.income),
            Expense: Math.round(m.expense),
            isForecast: false,
        }));

        const currentMonthKey = format(startOfMonth(TODAY), 'yyyy-MM');

        // Add Forecast month to chart
        const forecastIncome = transactions
            .filter(t => t.type === 'income' && format(startOfMonth(parseISO(t.date)), 'yyyy-MM') === currentMonthKey)
            .reduce((s, t) => s + t.amount, 0);
        
        // Simple forecast for next month chart: Current month's income vs (Current month's income - expected savings)
        monthlyData.push({
            name: nextMonthName.substring(0, 3),
            Income: Math.round(forecastIncome), // Assume same income for simplicity in chart
            Expense: Math.round(forecastIncome - forecast.expectedSavings),
            isForecast: true,
        });

        return { topCategory, avgDailyExpense, savingsRate, monthlyData, forecast, nextMonthName };
    }, [transactions]);

    const savingsColor = savingsRate >= 20
        ? 'text-green-600 dark:text-green-400'
        : 'text-red-600 dark:text-red-400';

    if (transactions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl gap-4">
                <PiggyBank size={48} className="text-gray-200 dark:text-gray-700" />
                <div className="text-center">
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">Start your journey!</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Add some transactions to see deep insights.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <InsightCard
                    icon={ShoppingBag}
                    label="Top Spending Category"
                    value={topCategory[0]}
                    sub={`Total: ${formatCurrency(topCategory[1])}`}
                />
                <InsightCard
                    icon={TrendingDown}
                    label="Avg Daily Expense (30d)"
                    value={formatCurrency(avgDailyExpense)}
                    sub="Average over the last 30 days"
                />
                <InsightCard
                    icon={PiggyBank}
                    label="Savings Rate"
                    value={`${savingsRate.toFixed(1)}%`}
                    sub={savingsRate >= 20 ? '✅ On track' : '⚠️ Below 20% target'}
                    valueColor={savingsColor}
                />
                <InsightCard
                    isSpecial
                    icon={Zap}
                    label={`Forecast for ${nextMonthName}`}
                    value={formatCurrency(forecast.predictedBalance)}
                    sub={forecast.isPositive ? '📈 Projected growth' : '📉 Projected dip'}
                    valueColor={forecast.isPositive ? 'text-teal-600 dark:text-teal-400' : 'text-rose-600 dark:text-rose-400'}
                />
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Monthly Income vs Expenses
                        </h2>
                        <div className="flex items-center gap-4 text-[10px] font-medium uppercase tracking-wider text-gray-400">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                Income
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                Expense
                            </div>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={monthlyData} barCategoryGap="25%" barGap={8} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-gray-100 dark:text-gray-800/60" />
                            <XAxis
                                dataKey="name"
                                tick={{ fontSize: 12, fill: 'currentColor' }}
                                className="text-gray-400 dark:text-gray-500"
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                                tick={{ fontSize: 11, fill: 'currentColor' }}
                                className="text-gray-400 dark:text-gray-500"
                                tickLine={false}
                                axisLine={false}
                                width={52}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'currentColor', opacity: 0.05 }} />
                            <Bar dataKey="Income" radius={[4, 4, 0, 0]}>
                                {monthlyData.map((entry, index) => (
                                    <Cell key={`cell-inc-${index}`} fill="#22c55e" fillOpacity={entry.isForecast ? 0.35 : 1} strokeDasharray={entry.isForecast ? "4 4" : "0"} />
                                ))}
                            </Bar>
                            <Bar dataKey="Expense" radius={[4, 4, 0, 0]}>
                                {monthlyData.map((entry, index) => (
                                    <Cell key={`cell-exp-${index}`} fill="#ef4444" fillOpacity={entry.isForecast ? 0.35 : 1} strokeDasharray={entry.isForecast ? "4 4" : "0"} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
