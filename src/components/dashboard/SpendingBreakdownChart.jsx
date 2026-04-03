import { useMemo } from 'react';
import {
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { CATEGORY_COLORS } from '../../utils/helpers';

function CustomTooltip({ active, payload }) {
    if (!active || !payload?.length) return null;
    const { name, value } = payload[0];
    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 shadow-lg text-sm">
            <p className="font-medium text-gray-700 dark:text-gray-200">{name}</p>
            <p className="font-bold text-gray-900 dark:text-white">
                ₹{value.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
        </div>
    );
}

function CustomLegend({ payload }) {
    return (
        <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-3 px-2">
            {payload.map(({ value, color }) => (
                <li key={value} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                    <span className="inline-block w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
                    {value}
                </li>
            ))}
        </ul>
    );
}

export default function SpendingBreakdownChart({ transactions }) {
    const data = useMemo(() => {
        const totals = {};
        transactions
            .filter((t) => t.type === 'expense')
            .forEach((t) => {
                totals[t.category] = (totals[t.category] || 0) + t.amount;
            });

        return Object.entries(totals)
            .map(([name, value]) => ({ name, value: Math.round(value) }))
            .sort((a, b) => b.value - a.value);
    }, [transactions]);

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                Spending Breakdown
            </h2>

            {data.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center gap-2">
                    <span className="text-4xl">🎉</span>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No expenses recorded yet!</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">Add some transactions to see breakdown.</p>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="45%"
                            innerRadius={60}
                            outerRadius={95}
                            paddingAngle={3}
                            strokeWidth={0}
                        >
                            {data.map(({ name }) => (
                                <Cell
                                    key={name}
                                    fill={CATEGORY_COLORS[name] ?? '#94a3b8'}
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend content={<CustomLegend />} />
                    </PieChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}
