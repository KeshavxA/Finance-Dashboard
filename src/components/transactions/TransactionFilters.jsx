import { Search, RotateCcw } from 'lucide-react';
import useStore from '../../store/useStore';
import { CATEGORIES, TRANSLATIONS } from '../../utils/helpers';

const SORT_OPTIONS = [
    { value: 'date-desc', labelKey: 'newest' },
    { value: 'date-asc', labelKey: 'oldest' },
    { value: 'amount-desc', labelKey: 'highest' },
    { value: 'amount-asc', labelKey: 'lowest' },
];

const selectClass = `
  w-full rounded-lg border border-gray-200 dark:border-gray-700
  bg-white dark:bg-gray-800
  text-sm text-gray-700 dark:text-gray-200
  px-3 py-2.5 pr-8
  focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
  cursor-pointer transition-colors appearance-none
`;

export default function TransactionFilters() {
    const filters = useStore((s) => s.filters);
    const setFilters = useStore((s) => s.setFilters);
    const resetFilters = useStore((s) => s.resetFilters);
    const language = useStore((s) => s.language);

    const T = TRANSLATIONS[language] || TRANSLATIONS.en;

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-sm">
            <div className="flex flex-wrap gap-3 items-end">

                <div className="relative flex-1 min-w-[180px]">
                    <Search
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
                    />
                    <input
                        type="text"
                        placeholder={T.search}
                        value={filters.search}
                        onChange={(e) => setFilters({ search: e.target.value })}
                        className="
              w-full rounded-lg border border-gray-200 dark:border-gray-700
              bg-white dark:bg-gray-800
              text-sm text-gray-700 dark:text-gray-200
              pl-9 pr-3 py-2.5
              focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
              transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500
            "
                    />
                </div>

                <div className="relative min-w-[155px]">
                    <select
                        value={filters.sortBy}
                        onChange={(e) => setFilters({ sortBy: e.target.value })}
                        className={selectClass}
                    >
                        <option value="date-desc">Newest First</option>
                        <option value="date-asc">Oldest First</option>
                        <option value="amount-desc">Highest Amount</option>
                        <option value="amount-asc">Lowest Amount</option>
                    </select>
                    <ChevronIcon />
                </div>

                <div className="relative min-w-[160px]">
                    <select
                        value={filters.groupBy || 'none'}
                        onChange={(e) => setFilters({ groupBy: e.target.value })}
                        className={selectClass}
                    >
                        <option value="none">{T.groupBy}: {T.none}</option>
                        <option value="date">{T.groupBy}: {T.date}</option>
                        <option value="category">{T.groupBy}: {T.category}</option>
                    </select>
                    <ChevronIcon />
                </div>

                <button
                    onClick={resetFilters}
                    className="
            flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium
            text-gray-600 dark:text-gray-400
            bg-gray-100 dark:bg-gray-800
            hover:bg-gray-200 dark:hover:bg-gray-700
            border border-gray-200 dark:border-gray-700
            transition-colors shrink-0
          "
                >
                    <RotateCcw size={14} />
                    Reset
                </button>
            </div>
        </div>
    );
}

function ChevronIcon() {
    return (
        <svg
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
            width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
            <polyline points="6 9 12 15 18 9" />
        </svg>
    );
}
