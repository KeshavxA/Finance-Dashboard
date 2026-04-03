import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import useStore from '../../store/useStore';
import { CATEGORIES } from '../../utils/helpers';
import { format } from 'date-fns';

const EXPENSE_CATEGORIES = CATEGORIES.filter(
    (c) => c !== 'Salary' && c !== 'Freelance'
);
const INCOME_CATEGORIES = ['Salary', 'Freelance'];

const TODAY = format(new Date(2026, 3, 2), 'yyyy-MM-dd');

const BLANK = {
    description: '',
    amount: '',
    date: TODAY,
    category: 'Food',
    type: 'expense',
};

const inputClass = `
  w-full rounded-lg border border-gray-200 dark:border-gray-700
  bg-gray-50 dark:bg-gray-800
  text-sm text-gray-800 dark:text-gray-200
  px-3 py-2.5
  focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
  transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500
`;

export default function AddTransactionModal({ onClose, editTx }) {
    const addTransaction = useStore((s) => s.addTransaction);
    const updateTransaction = useStore((s) => s.updateTransaction);

    const [form, setForm] = useState(BLANK);
    const [errors, setErrors] = useState({});

    // Pre-fill when editing
    useEffect(() => {
        if (editTx) {
            setForm({
                description: editTx.description,
                amount: String(editTx.amount),
                date: editTx.date,
                category: editTx.category,
                type: editTx.type,
            });
        }
    }, [editTx]);

    // Keep category valid when type changes
    const handleTypeChange = (type) => {
        const validCategories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
        setForm((prev) => ({
            ...prev,
            type,
            category: validCategories.includes(prev.category)
                ? prev.category
                : validCategories[0],
        }));
    };

    const validate = () => {
        const errs = {};
        if (!form.description.trim()) errs.description = 'Description is required.';
        if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
            errs.amount = 'Enter a valid positive amount.';
        return errs;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }

        const payload = {
            description: form.description.trim(),
            amount: parseFloat(parseFloat(form.amount).toFixed(2)),
            date: form.date,
            category: form.category,
            type: form.type,
        };

        if (editTx) {
            updateTransaction(editTx.id, payload);
        } else {
            addTransaction({
                ...payload,
                id: `txn_${Date.now()}`,
            });
        }
        onClose();
    };

    const categoryOptions =
        form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

    return (
        // Backdrop
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            {/* Modal panel */}
            <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                        {editTx ? 'Edit Transaction' : 'Add Transaction'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        aria-label="Close modal"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

                    {/* Type toggle */}
                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                            Type
                        </label>
                        <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                            {['expense', 'income'].map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => handleTypeChange(t)}
                                    className={`
                    flex-1 py-2 text-sm font-medium capitalize transition-colors
                    ${form.type === t
                                            ? t === 'income'
                                                ? 'bg-green-500 text-white'
                                                : 'bg-red-500 text-white'
                                            : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                        }
                  `}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                            Description
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Swiggy order"
                            value={form.description}
                            onChange={(e) => {
                                setForm((p) => ({ ...p, description: e.target.value }));
                                setErrors((p) => ({ ...p, description: undefined }));
                            }}
                            className={inputClass}
                        />
                        {errors.description && (
                            <p className="text-xs text-red-500 mt-1">{errors.description}</p>
                        )}
                    </div>

                    {/* Amount + Date row */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                                Amount (₹)
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                value={form.amount}
                                onChange={(e) => {
                                    setForm((p) => ({ ...p, amount: e.target.value }));
                                    setErrors((p) => ({ ...p, amount: undefined }));
                                }}
                                className={inputClass}
                            />
                            {errors.amount && (
                                <p className="text-xs text-red-500 mt-1">{errors.amount}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                                Date
                            </label>
                            <input
                                type="date"
                                value={form.date}
                                onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                                className={inputClass}
                            />
                        </div>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                            Category
                        </label>
                        <select
                            value={form.category}
                            onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                            className={inputClass}
                        >
                            {categoryOptions.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    {/* Footer buttons */}
                    <div className="flex gap-3 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
                        >
                            {editTx ? 'Save Changes' : 'Add Transaction'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
