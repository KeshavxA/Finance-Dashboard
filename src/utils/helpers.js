

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

export const TRANSLATIONS = {
    en: {
        dashboard: 'Dashboard',
        transactions: 'Transactions',
        insights: 'Insights',
        balance: 'Total Balance',
        income: 'Total Income',
        expenses: 'Total Expenses',
        add: 'Add Transaction',
        export: 'Export',
        search: 'Search description...',
    },
    hi: {
        dashboard: 'डैशबोर्ड',
        transactions: 'लेनदेन',
        insights: 'इनसाइट्स',
        balance: 'कुल शेष',
        income: 'कुल आय',
        expenses: 'कुल खर्च',
        add: 'लेनदेन जोड़ें',
        export: 'निर्यात',
        search: 'विवरण खोजें...',
    },
    es: {
        dashboard: 'Tablero',
        transactions: 'Transacciones',
        insights: 'Perspectivas',
        balance: 'Balance Total',
        income: 'Ingresos Totales',
        expenses: 'Gastos Totales',
        add: 'Añadir Transacción',
        export: 'Exportar',
        search: 'Buscar descripción...',
    },
    nl: {
        dashboard: 'Dashboard',
        transactions: 'Transacties',
        insights: 'Inzichten',
        balance: 'Totaal Saldo',
        income: 'Totale Inkomsten',
        expenses: 'Totale Uitgaven',
        add: 'Transactie Toevoegen',
        export: 'Exporteren',
        search: 'Beschrijving zoeken...',
    },
};

