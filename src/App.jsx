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
import { Plus } from 'lucide-react';

export default function App() {
  const activePage = useStore((s) => s.activePage);
  const transactions = useStore((s) => s.transactions);
  const filters = useStore((s) => s.filters);
  const role = useStore((s) => s.role);

  const [showModal, setShowModal] = useState(false);
  const [editTx, setEditTx] = useState(null);

  const openAdd = () => { setEditTx(null); setShowModal(true); };
  const openEdit = (tx) => { setEditTx(tx); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditTx(null); };

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
      case 'date-desc':
        list.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'date-asc':
        list.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'amount-desc':
        list.sort((a, b) => b.amount - a.amount);
        break;
      case 'amount-asc':
        list.sort((a, b) => a.amount - b.amount);
        break;
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
        <div className="space-y-4 pb-20 md:pb-0">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">
              All Transactions
              <span className="ml-2 text-sm font-normal text-gray-400 dark:text-gray-500">
                ({filtered.length})
              </span>
            </h2>
            {role === 'admin' && (
              <button
                onClick={openAdd}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
              >
                <Plus size={16} />
                Add Transaction
              </button>
            )}
          </div>

          <TransactionFilters />
          <TransactionTable transactions={filtered} onEdit={openEdit} />
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
