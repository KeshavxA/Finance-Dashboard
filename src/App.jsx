import { useState, useMemo } from 'react';
import useStore from './store/useStore';
import Layout from './components/layout/Layout';
import SummaryCards from './components/dashboard/SummaryCards';
import BalanceTrendChart from './components/dashboard/BalanceTrendChart';
import SpendingBreakdownChart from './components/dashboard/SpendingBreakdownChart';
import TransactionFilters from './components/transactions/TransactionFilters';
import TransactionTable from './components/transactions/TransactionTable';
import AddTransactionModal from './components/transactions/AddTransactionModal';
import InsightsSection from './components/insights/InsightsSection';
import { Plus, Download } from 'lucide-react';
import Papa from 'papaparse';
import { TRANSLATIONS } from './utils/helpers';

export default function App() {
  const activePage = useStore((s) => s.activePage);
  const transactions = useStore((s) => s.transactions);
  const filters = useStore((s) => s.filters);
  const role = useStore((s) => s.role);
  const language = useStore((s) => s.language);

  const T = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [showModal, setShowModal] = useState(false);
  const [editTx, setEditTx] = useState(null);

  const openAdd = () => { setEditTx(null); setShowModal(true); };
  const openEdit = (tx) => { setEditTx(tx); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditTx(null); };

  const exportToCSV = () => {
    const csv = Papa.unparse(
      filtered.map(({ id, date, type, category, description, amount }) => ({
        ID: id,
        Date: date,
        Type: type,
        Category: category,
        Description: description,
        Amount: amount,
      }))
    );
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'transactions.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const filtered = useMemo(() => {
    let list = [...transactions];

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }

    if (filters.category !== 'All') {
      list = list.filter((t) => t.category === filters.category);
    }

    if (filters.type !== 'All') {
      list = list.filter((t) => t.type === filters.type);
    }

    switch (filters.sortBy) {
      case 'date-desc': list.sort((a, b) => new Date(b.date) - new Date(a.date)); break;
      case 'date-asc': list.sort((a, b) => new Date(a.date) - new Date(b.date)); break;
      case 'amount-desc': list.sort((a, b) => b.amount - a.amount); break;
      case 'amount-asc': list.sort((a, b) => a.amount - b.amount); break;
    }

    return list;
  }, [transactions, filters]);

  return (
    <Layout>
      {activePage === 'dashboard' && (
        <div className="space-y-6 pb-20 md:pb-0">
          <SummaryCards transactions={transactions} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BalanceTrendChart transactions={transactions} />
            <SpendingBreakdownChart transactions={transactions} />
          </div>
        </div>
      )}

      {activePage === 'transactions' && (
        <div className="pb-20 md:pb-0">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">

            <div className="flex items-center justify-between gap-3 flex-wrap px-5 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">
                All Transactions
              </h2>
              {role === 'admin' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={exportToCSV}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium transition-colors"
                  >
                    <Download size={15} />
                    {T.export}
                  </button>
                  <button
                    onClick={openAdd}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium transition-colors"
                  >
                    <Plus size={15} />
                    {T.add}
                  </button>
                </div>
              )}
            </div>

            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
              <TransactionFilters />
            </div>

            <TransactionTable transactions={filtered} onEdit={openEdit} />

            <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Showing{' '}
                <span className="font-semibold text-gray-600 dark:text-gray-300">
                  {filtered.length}
                </span>{' '}
                of{' '}
                <span className="font-semibold text-gray-600 dark:text-gray-300">
                  {transactions.length}
                </span>{' '}
                transactions
              </p>
            </div>
          </div>
        </div>
      )}
      {activePage === 'insights' && (
        <div className="pb-20 md:pb-0">
          <InsightsSection transactions={transactions} />
        </div>
      )}

      {showModal && (
        <AddTransactionModal onClose={closeModal} editTx={editTx} />
      )}

    </Layout>
  );
}
