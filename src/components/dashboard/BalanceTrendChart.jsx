import { useMemo } from 'react';
import { subDays, format, parseISO } from 'date-fns';
import {
    LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';

const DAYS = 30;

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 shadow-lg text-sm">
            <p className="font-medium text-gray-500 dark:text-gray-400 mb-0.5">{label}</p>
            <p className="font-bold text-teal-600 dark:text-teal-400">
                ₹{(payload[0].value / 1000).toFixed(1)}k
            </p>
        </div>
    );
}

export default function BalanceTrendChart({ transactions }) {
    const data = useMemo(() => {
        const today = new Date(2026, 3, 2);
        const dayMap = {};

        transactions.forEach((t) => {
            if (!dayMap[t.date]) dayMap[t.date] = { income: 0, expense: 0 };
            if (t.type === 'income') dayMap[t.date].income += t.amount;
            if (t.type === 'expense') dayMap[t.date].expense += t.amount;
        });

        let runningBalance = 0;

        transactions.forEach((t) => {
            const d = parseISO(t.date);
            if (d < subDays(today, DAYS - 1)) {
                runningBalance += t.type === 'income' ? t.amount : -t.amount;
            }
        });

        const points = [];
        for (let i = DAYS - 1; i >= 0; i--) {
            const date = subDays(today, i);
            const dateStr = format(date, 'yyyy-MM-dd');
            const day = dayMap[dateStr] || { income: 0, expense: 0 };
            runningBalance += day.income - day.expense;
            points.push({
                date: format(date, 'd MMM'),
                balance: Math.round(runningBalance),
            });
        }
        return points;
    }, [transactions]);

    const tickFormatter = (v) => `₹${(v / 1000).toFixed(0)}k`;

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wider text-[10px]">
                Balance Trend (Last 30 Days)
            </h2>
            <ResponsiveContainer width="100%" height={220}>
                <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-gray-100 dark:text-gray-800/60" />
                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 11, fill: 'currentColor' }}
                        className="text-gray-400 dark:text-gray-500"
                        tickLine={false}
                        axisLine={false}
                        interval={4}
                    />
                    <YAxis
                        tickFormatter={tickFormatter}
                        tick={{ fontSize: 11, fill: 'currentColor' }}
                        className="text-gray-400 dark:text-gray-500"
                        tickLine={false}
                        axisLine={false}
                        width={48}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                        type="monotone"
                        dataKey="balance"
                        stroke="#0d9488"
                        strokeWidth={2.5}
                        dot={false}
                        activeDot={{ r: 5, fill: '#0d9488', strokeWidth: 0 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
