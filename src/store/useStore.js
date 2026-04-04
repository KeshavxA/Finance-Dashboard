import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { INITIAL_TRANSACTIONS } from '../data/mockData';

const DEFAULT_FILTERS = {
    search: '',
    category: 'All',
    type: 'All',
    sortBy: 'date-desc',
    groupBy: 'none',
};

const useStore = create(
    persist(
        (set) => ({

            role: 'viewer',
            setRole: (role) => set({ role }),

            darkMode: false,
            toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

            language: 'en',
            setLanguage: (language) => set({ language }),

            activePage: 'dashboard',
            setActivePage: (activePage) => set({ activePage }),

            transactions: INITIAL_TRANSACTIONS,

            addTransaction: (transaction) =>
                set((state) => ({
                    transactions: [transaction, ...state.transactions],
                })),

            updateTransaction: (id, updatedFields) =>
                set((state) => ({
                    transactions: state.transactions.map((txn) =>
                        txn.id === id ? { ...txn, ...updatedFields } : txn
                    ),
                })),

            deleteTransaction: (id) =>
                set((state) => ({
                    transactions: state.transactions.filter((txn) => txn.id !== id),
                })),

            filters: { ...DEFAULT_FILTERS },

            setFilters: (partial) =>
                set((state) => ({
                    filters: { ...state.filters, ...partial },
                })),

            resetFilters: () => set({ filters: { ...DEFAULT_FILTERS } }),
        }),
        {
            name: 'finance-dashboard-storage',
        }
    )
);

export default useStore;
