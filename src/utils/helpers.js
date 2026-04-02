

const _currencyFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

/**
 * Format a number as Indian Rupee currency.
 * @param {number} amount
 * @returns {string}  e.g. "₹1,20,450.00"
 */
export function formatCurrency(amount) {
    return _currencyFormatter.format(amount);
}



/**
 * Format a yyyy-MM-dd date string to "02 Apr 2026" style.
 * @param {string} dateStr  
 * @returns {string}       
 */
export function formatDate(dateStr) {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}
export const CATEGORIES = [
    'Salary',
    'Freelance',
    'Food',
    'Transport',
    'Shopping',
    'Healthcare',
    'Entertainment',
    'Utilities',
];


export const CATEGORY_COLORS = {
    Salary: '#22c55e',
    Freelance: '#a78bfa',
    Food: '#f97316',
    Transport: '#3b82f6',
    Shopping: '#ec4899',
    Healthcare: '#10b981',
    Entertainment: '#06b6d4',
    Utilities: '#8b5cf6',
};
