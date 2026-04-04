import React, { Fragment } from 'react';
import { Pencil, Trash2, ReceiptText } from 'lucide-react';
import useStore from '../../store/useStore';
import { formatCurrency, formatDate, CATEGORY_COLORS, TRANSLATIONS } from '../../utils/helpers';

function CategoryBadge({ category }) {
    const color = CATEGORY_COLORS[category] ?? '#94a3b8';
    return (
        <span
            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: `${color}20`, color }}
        >
            {category}
        </span>
    );
}

function TypeBadge({ type }) {
    const isIncome = type === 'income';
    return (
        <span
            className={`
        inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize
        ${isIncome
                    ? 'bg-green-50  text-green-700  dark:bg-green-950  dark:text-green-400'
                    : 'bg-red-50    text-red-700    dark:bg-red-950    dark:text-red-400'
                }
      `}
        >
            {type}
        </span>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <ReceiptText size={32} className="text-gray-300 dark:text-gray-600" />
            </div>
            <p className="text-base font-semibold text-gray-400 dark:text-gray-500">No transactions found</p>
            <p className="text-sm text-gray-400 dark:text-gray-600 max-w-xs">
                Try adjusting your filters, or add a new transaction to get started.
            </p>
        </div>
    );
}

export default function TransactionTable({ transactions, onEdit }) {
    const role = useStore((s) => s.role);
    const deleteTransaction = useStore((s) => s.deleteTransaction);
    const filters = useStore((s) => s.filters);
    const language = useStore((s) => s.language);
    const isAdmin = role === 'admin';

    const T = TRANSLATIONS[language] || TRANSLATIONS.en;
    const groupBy = filters.groupBy || 'none';

    function TransactionRow({ tx }) {
        const isIncome = tx.type === 'income';
        return (
            <tr className="hover:bg-gray-50/80 dark:hover:bg-gray-800/60 transition-all duration-200 group">
                <td className="px-5 py-3.5 whitespace-nowrap text-gray-500 dark:text-gray-400 text-xs text-center md:text-left">
                    {formatDate(tx.date)}
                </td>
                <td className="px-5 py-3.5 text-gray-800 dark:text-gray-200 font-medium max-w-[220px] truncate">
                    {tx.description}
                </td>
                <td className="px-5 py-3.5 whitespace-nowrap">
                    <CategoryBadge category={tx.category} />
                </td>
                <td className="px-5 py-3.5 whitespace-nowrap">
                    <TypeBadge type={tx.type} />
                </td>
                <td className={`px-5 py-3.5 whitespace-nowrap text-right font-semibold ${isIncome
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600  dark:text-red-400'
                    }`}>
                    {isIncome ? '+' : '−'}{formatCurrency(tx.amount)}
                </td>
                {isAdmin && (
                    <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                            <button
                                onClick={() => onEdit(tx)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950 dark:hover:text-teal-400 transition-colors"
                            >
                                <Pencil size={14} />
                            </button>
                            <button
                                onClick={() => deleteTransaction(tx.id)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 dark:hover:text-red-400 transition-colors"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </td>
                )}
            </tr>
        );
    }

    const renderTableRows = () => {
        if (groupBy === 'none') {
            return transactions.map((tx) => <TransactionRow key={tx.id} tx={tx} />);
        }

        const groups = {};
        transactions.forEach((tx) => {
            let key = '';
            if (groupBy === 'date') key = formatDate(tx.date);
            if (groupBy === 'category') key = tx.category;

            if (!groups[key]) groups[key] = [];
            groups[key].push(tx);
        });

        return Object.entries(groups).map(([groupName, items]) => (
            <Fragment key={groupName}>
                <tr className="bg-gray-100/60 dark:bg-gray-800/80">
                    <td
                        colSpan={isAdmin ? 6 : 5}
                        className="px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400 text-left border-y border-gray-100 dark:border-gray-800"
                    >
                        {groupName} <span className="opacity-40">•</span> {items.length} {items.length === 1 ? T.item : T.items}
                    </td>
                </tr>
                {items.map((tx) => (
                    <TransactionRow key={tx.id} tx={tx} />
                ))}
            </Fragment>
        ));
    };

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
            {transactions.length === 0 ? (
                <EmptyState />
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                                <th className="text-left px-5 py-3 font-semibold text-gray-400 dark:text-gray-500 whitespace-nowrap uppercase tracking-wider text-[10px]">{T.date.toUpperCase()}</th>
                                <th className="text-left px-5 py-3 font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-[10px]">DESCRIPTION</th>
                                <th className="text-left px-5 py-3 font-semibold text-gray-400 dark:text-gray-500 whitespace-nowrap uppercase tracking-wider text-[10px]">{T.category.toUpperCase()}</th>
                                <th className="text-left px-5 py-3 font-semibold text-gray-400 dark:text-gray-500 whitespace-nowrap uppercase tracking-wider text-[10px]">TYPE</th>
                                <th className="text-right px-5 py-3 font-semibold text-gray-400 dark:text-gray-500 whitespace-nowrap uppercase tracking-wider text-[10px]">AMOUNT</th>
                                {isAdmin && (
                                    <th className="text-center px-5 py-3 font-semibold text-gray-400 dark:text-gray-500 whitespace-nowrap uppercase tracking-wider text-[10px]">ACTIONS</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                            {renderTableRows()}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
