import { Search, RotateCcw } from 'lucide-react';
import useStore from '../../store/useStore';
import { CATEGORIES } from '../../utils/helpers';

const SORT_OPTIONS = [
    { value: 'date-desc', label: 'Newest First' },
    { value: 'date-asc', label: 'Oldest First' },
    { value: 'amount-desc', label: 'Highest Amount' },
    { value: 'amount-asc', label: 'Lowest Amount' },
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

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-sm">
            <div className="flex flex-wrap gap-3 items-end">

                {/* ── Search ─────────────────────────────────────────────────────── */}
                <div className="relative flex-1 min-w-[180px]">
                    <Search
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
                    />
                    <input
                        type="text"
                        placeholder="Search transactions…"
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

                {/* ── Category ───────────────────────────────────────────────────── */}
                <div className="relative min-w-[150px]">
                    <select
                        value={filters.category}
                        onChange={(e) => setFilters({ category: e.target.value })}
                        className={selectClass}
                    >
                        <option value="All">All Categories</option>
                        {CATEGORIES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                    <ChevronIcon />
                </div>

                {/* ── Type ───────────────────────────────────────────────────────── */}
                <div className="relative min-w-[130px]">
                    <select
                        value={filters.type}
                        onChange={(e) => setFilters({ type: e.target.value })}
                        className={selectClass}
                    >
                        <option value="All">All Types</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                    <ChevronIcon />
                </div>

                {/* ── Sort ───────────────────────────────────────────────────────── */}
                <div className="relative min-w-[155px]">
                    <select
                        value={filters.sortBy}
                        onChange={(e) => setFilters({ sortBy: e.target.value })}
                        className={selectClass}
                    >
                        {SORT_OPTIONS.map(({ value, label }) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                    <ChevronIcon />
                </div>

                {/* ── Reset ──────────────────────────────────────────────────────── */}
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
