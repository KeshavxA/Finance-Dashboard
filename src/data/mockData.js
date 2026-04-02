import { subDays, format } from 'date-fns';

// ─── Categories ───────────────────────────────────────────────────────────────

export const EXPENSE_CATEGORIES = [
    'Food',
    'Transport',
    'Shopping',
    'Healthcare',
    'Entertainment',
    'Utilities',
];

export const INCOME_CATEGORIES = ['Salary', 'Freelance'];

export const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

// ─── Colors ───────────────────────────────────────────────────────────────────

export const CATEGORY_COLORS = {
    Food: '#f97316',
    Transport: '#3b82f6',
    Shopping: '#ec4899',
    Healthcare: '#10b981',
    Entertainment: '#06b6d4',
    Utilities: '#8b5cf6',
    Salary: '#22c55e',
    Freelance: '#a78bfa',
};

// ─── Descriptions ─────────────────────────────────────────────────────────────

const DESCRIPTIONS = {
    Food: ['Swiggy order', 'Zomato delivery', 'Grocery run', 'Coffee at Starbucks', 'McDonald\'s lunch', 'Local restaurant dinner'],
    Transport: ['Uber ride', 'Ola cab', 'Metro card recharge', 'Petrol fill-up', 'Rapido bike ride'],
    Shopping: ['Amazon order', 'Flipkart purchase', 'Myntra clothes', 'Decathlon gear', 'Reliance Fresh groceries'],
    Healthcare: ['Apollo Pharmacy', 'Doctor consultation', 'MedPlus medicines', 'Gym membership fee'],
    Entertainment: ['Netflix subscription', 'BookMyShow tickets', 'Spotify Premium', 'Amazon Prime renewal'],
    Utilities: ['Electricity bill', 'Airtel broadband', 'Jio recharge', 'Water bill', 'Gas cylinder booking'],
    Salary: ['Monthly salary credit', 'Salary deposit'],
    Freelance: ['Client project payment', 'Consulting fee', 'Upwork contract payout'],
};

// ─── Amount ranges (₹) ───────────────────────────────────────────────────────

const AMOUNT_RANGES = {
    Food: [80, 800],
    Transport: [30, 500],
    Shopping: [300, 5000],
    Healthcare: [200, 3000],
    Entertainment: [99, 999],
    Utilities: [200, 2000],
    Salary: [45000, 90000],
    Freelance: [5000, 30000],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rand = (min, max) =>
    Math.round((Math.random() * (max - min) + min) * 100) / 100;

let _counter = 1;

function createTransaction(date, type, category) {
    const [min, max] = AMOUNT_RANGES[category];
    return {
        id: `txn_${String(_counter++).padStart(4, '0')}`,
        date: format(date, 'yyyy-MM-dd'),
        type,                          // 'income' | 'expense'
        category,
        description: pick(DESCRIPTIONS[category]),
        amount: rand(min, max),
    };
}

// ─── Generator ────────────────────────────────────────────────────────────────

export function generateTransactions() {
    _counter = 1;
    const today = new Date(2026, 3, 2); // April 2 2026 — deterministic anchor
    const result = [];

    for (let day = 0; day < 60; day++) {
        const date = subDays(today, day);
        const txPerDay = Math.floor(Math.random() * 4) + 1; // 1–4 per day

        for (let i = 0; i < txPerDay; i++) {
            // 20% chance income, 80% expense
            const isIncome = Math.random() < 0.2;
            const type = isIncome ? 'income' : 'expense';
            const category = isIncome
                ? pick(INCOME_CATEGORIES)
                : pick(EXPENSE_CATEGORIES);

            result.push(createTransaction(date, type, category));
        }
    }

    // Sort descending: newest first
    result.sort((a, b) => new Date(b.date) - new Date(a.date));

    return result;
}

// ─── Pre-generated export ─────────────────────────────────────────────────────

export const INITIAL_TRANSACTIONS = generateTransactions();
