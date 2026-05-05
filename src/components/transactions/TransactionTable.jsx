import React, { Fragment, useMemo } from 'react';
import { Pencil, Trash2, ReceiptText } from 'lucide-react';
import { motion } from 'framer-motion';
import * as ReactWindow from 'react-window';
import * as AutoSizerModule from 'react-virtualized-auto-sizer';
import useStore from '../../store/useStore';

const List = ReactWindow.FixedSizeList || ReactWindow.default?.FixedSizeList;
const AutoSizer = AutoSizerModule.default || AutoSizerModule.AutoSizer;
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

    // Virtualization Logic: Flatten groups into a single list
    const virtualItems = useMemo(() => {
        if (groupBy === 'none') {
            return transactions.map(tx => ({ type: 'row', data: tx }));
        }

        const groups = {};
        transactions.forEach((tx) => {
            let key = '';
            if (groupBy === 'date') key = formatDate(tx.date);
            if (groupBy === 'category') key = tx.category;

            if (!groups[key]) groups[key] = [];
            groups[key].push(tx);
        });

        const flattened = [];
        Object.entries(groups).forEach(([groupName, items]) => {
            flattened.push({ type: 'header', label: groupName, count: items.length });
            items.forEach(tx => {
                flattened.push({ type: 'row', data: tx });
            });
        });
        return flattened;
    }, [transactions, groupBy]);

    const Row = ({ index, style }) => {
        const item = virtualItems[index];

        if (item.type === 'header') {
            return (
                <div style={style} className="bg-gray-100/60 dark:bg-gray-800/80 px-5 py-2 flex items-center border-y border-gray-100 dark:border-gray-800 z-10">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">
                        {item.label} <span className="opacity-40 ml-1">•</span> {item.count} {item.count === 1 ? T.item : T.items}
                    </span>
                </div>
            );
        }

        const tx = item.data;
        const isIncome = tx.type === 'income';

        return (
            <div style={style} className="flex items-center hover:bg-gray-50/80 dark:hover:bg-gray-800/60 transition-all duration-200 border-b border-gray-50 dark:border-gray-800 text-sm group">
                <div className="w-[15%] px-5 py-3.5 text-gray-500 dark:text-gray-400 text-xs truncate">
                    {formatDate(tx.date)}
                </div>
                <div className="w-[30%] px-5 py-3.5 text-gray-800 dark:text-gray-200 font-medium truncate">
                    {tx.description}
                </div>
                <div className="w-[15%] px-5 py-3.5 truncate">
                    <CategoryBadge category={tx.category} />
                </div>
                <div className="w-[15%] px-5 py-3.5 truncate">
                    <TypeBadge type={tx.type} />
                </div>
                <div className={`w-[15%] px-5 py-3.5 text-right font-semibold ${isIncome ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {isIncome ? '+' : '−'}{formatCurrency(tx.amount)}
                </div>
                {isAdmin && (
                    <div className="w-[10%] px-5 py-3.5 flex items-center justify-center gap-2">
                        <button onClick={() => onEdit(tx)} className="p-1.5 rounded-lg text-gray-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950 dark:hover:text-teal-400 transition-colors">
                            <Pencil size={14} />
                        </button>
                        <button onClick={() => deleteTransaction(tx.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 dark:hover:text-red-400 transition-colors">
                            <Trash2 size={14} />
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[600px]">
            {transactions.length === 0 ? (
                <EmptyState />
            ) : (
                <>
                    {/* Sticky Header */}
                    <div className="flex items-center border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 shrink-0 pr-[10px]">
                        <div className="w-[15%] px-5 py-3 font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-[10px]">{T.date.toUpperCase()}</div>
                        <div className="w-[30%] px-5 py-3 font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-[10px]">DESCRIPTION</div>
                        <div className="w-[15%] px-5 py-3 font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-[10px]">{T.category.toUpperCase()}</div>
                        <div className="w-[15%] px-5 py-3 font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-[10px]">TYPE</div>
                        <div className="w-[15%] px-5 py-3 text-right font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-[10px]">AMOUNT</div>
                        {isAdmin && <div className="w-[10%] px-5 py-3 text-center font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-[10px]">ACTIONS</div>}
                    </div>

                    {/* Virtualized List */}
                    <div className="flex-1">
                        <AutoSizer>
                            {({ height, width }) => (
                                <List
                                    height={height}
                                    itemCount={virtualItems.length}
                                    itemSize={54}
                                    width={width}
                                >
                                    {Row}
                                </List>
                            )}
                        </AutoSizer>
                    </div>
                </>
            )}
        </div>
    );
}
