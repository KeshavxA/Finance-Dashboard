const _currencyFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

export function formatCurrency(amount) {
    return _currencyFormatter.format(amount);
}

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
    'Salary', 'Freelance', 'Food', 'Transport', 'Shopping', 'Healthcare', 'Entertainment', 'Utilities',
];

export const CATEGORY_COLORS = {
    Salary: '#22c55e', Freelance: '#a78bfa', Food: '#f97316', Transport: '#3b82f6',
    Shopping: '#ec4899', Healthcare: '#10b981', Entertainment: '#06b6d4', Utilities: '#8b5cf6',
};

export const TRANSLATIONS = {
    en: {
        dashboard: 'Dashboard', transactions: 'Transactions', insights: 'Insights',
        balance: 'Total Balance', income: 'Total Income', expenses: 'Total Expenses',
        add: 'Add Transaction', export: 'Export', search: 'Search description...',
        groupBy: 'Group By', none: 'None', date: 'Date', category: 'Category',
        items: 'items', item: 'item'
    },
    hi: {
        dashboard: 'डैशबोर्ड', transactions: 'लेनदेन', insights: 'इनसाइट्स',
        balance: 'कुल शेष', income: 'कुल आय', expenses: 'कुल खर्च',
        add: 'लेनदेन जोड़ें', export: 'निर्यात', search: 'विवरण खोजें...',
        groupBy: 'समूहबद्ध करें', none: 'कोई नहीं', date: 'तिथि', category: 'श्रेणी',
        items: 'आइटम', item: 'आइटम'
    },
    es: {
        dashboard: 'Tablero', transactions: 'Transacciones', insights: 'Perspectivas',
        balance: 'Balance Total', income: 'Ingresos Totales', expenses: 'Gastos Totales',
        add: 'Añadir Transacción', export: 'Exportar', search: 'Buscar descripción...',
        groupBy: 'Agrupar por', none: 'Ninguno', date: 'Fecha', category: 'Categoría',
        items: 'elementos', item: 'elemento'
    },
    nl: {
        dashboard: 'Dashboard', transactions: 'Transacties', insights: 'Inzichten',
        balance: 'Totaal Saldo', income: 'Totale Inkomsten', expenses: 'Totale Uitgaven',
        add: 'Transactie Toevoegen', export: 'Exporteren', search: 'Beschrijving zoeken...',
        groupBy: 'Groeperen op', none: 'Geen', date: 'Datum', category: 'Categorie',
        items: 'items', item: 'item'
    },
};
