import { Pencil, Trash2, ReceiptText } from 'lucide-react';
import useStore from '../../store/useStore';
import { formatCurrency, formatDate, CATEGORY_COLORS } from '../../utils/helpers';

\

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
    const isAdmin = role === 'admin';

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
            {transactions.length === 0 ? (
                <EmptyState />
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                                <th className="text-left px-5 py-3 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Date</th>
                                <th className="text-left px-5 py-3 font-medium text-gray-500 dark:text-gray-400">Description</th>
                                <th className="text-left px-5 py-3 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Category</th>
                                <th className="text-left px-5 py-3 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Type</th>
                                <th className="text-right px-5 py-3 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Amount</th>
                                {isAdmin && (
                                    <th className="text-center px-5 py-3 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Actions</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                            {transactions.map((tx) => {
                                const isIncome = tx.type === 'income';
                                return (
                                    <tr
                                        key={tx.id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                                    >
                                        <td className="px-5 py-3.5 whitespace-nowrap text-gray-500 dark:text-gray-400 text-xs">
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
                                                        className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 dark:hover:text-indigo-400 transition-colors"
                                                        aria-label="Edit transaction"
                                                    >
                                                        <Pencil size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteTransaction(tx.id)}
                                                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 dark:hover:text-red-400 transition-colors"
                                                        aria-label="Delete transaction"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
