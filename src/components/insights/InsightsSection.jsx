import { useMemo } from 'react';
import { subDays, format, parseISO, startOfMonth } from 'date-fns';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { TrendingUp, TrendingDown, PiggyBank, ShoppingBag } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

const TODAY = new Date(2026, 3, 2);

function InsightCard({ icon: Icon, label, value, sub, valueColor = 'text-gray-900 dark:text-white' }) {
    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm flex items-start gap-4">
            <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 shrink-0">
                <Icon size={20} className="text-indigo-500" />
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
    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 shadow-lg text-sm space-y-1">
            <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1">{label}</p>
            {payload.map((p) => (
                <p key={p.name} style={{ color: p.fill }} className="font-medium">
                    {p.name}: ₹{(p.value / 1000).toFixed(1)}k
                </p>
            ))}
        </div>
    );
}

export default function InsightsSection({ transactions }) {
    const { topCategory, avgDailyExpense, savingsRate, monthlyData } = useMemo(() => {
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
        }));

        return { topCategory, avgDailyExpense, savingsRate, monthlyData };
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                    Monthly Income vs Expenses
                </h2>
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
                        <Legend
                            wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
                            formatter={(value) => (
                                <span className="text-gray-600 dark:text-gray-400">{value}</span>
                            )}
                        />
                        <Bar dataKey="Income" fill="#22c55e" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
