import { subDays, format } from 'date-fns';

const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Shopping', 'Healthcare', 'Entertainment', 'Utilities'];
const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment Returns', 'Side Project'];

const DESCRIPTIONS = {
    Food: ['Swiggy order', 'Zomato delivery', 'Grocery run at DMart', 'Coffee at Starbucks', 'Dinner at local restaurant', 'McDonald\'s lunch'],
    Transport: ['Uber ride', 'Ola cab', 'Metro card recharge', 'Petrol fill-up', 'Rapido bike'],
    Shopping: ['Amazon order', 'Flipkart purchase', 'Myntra clothes', 'Decathlon gear', 'Reliance Fresh'],
    Healthcare: ['Apollo Pharmacy', 'Doctor consultation at Practo', 'MedPlus medicines', 'Gym membership'],
    Entertainment: ['Netflix subscription', 'BookMyShow tickets', 'Spotify Premium', 'Amazon Prime renewal'],
    Utilities: ['Electricity bill', 'Airtel broadband', 'Jio recharge', 'Water bill', 'Gas cylinder'],
    Salary: ['Monthly salary credit'],
    Freelance: ['Client project payment', 'Upwork contract', 'Consulting fee'],
    'Investment Returns': ['Zerodha dividend', 'Mutual fund returns', 'FD interest'],
    'Side Project': ['Product sale revenue', 'Ad revenue payout', 'SaaS subscription income'],
};

const AMOUNT_RANGES = {
    Food: [80, 800],
    Transport: [30, 500],
    Shopping: [300, 5000],
    Healthcare: [200, 3000],
    Entertainment: [99, 999],
    Utilities: [200, 2000],
    Salary: [50000, 90000],
    Freelance: [5000, 25000],
    'Investment Returns': [500, 8000],
    'Side Project': [1000, 12000],
};

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rand = (min, max) => Math.round((Math.random() * (max - min) + min) * 100) / 100;

let _id = 1;

function makeTransaction(date, type, category) {
    const [min, max] = AMOUNT_RANGES[category] ?? [100, 5000];
    return {
        id: `txn_${String(_id++).padStart(4, '0')}`,
        date: format(date, 'yyyy-MM-dd'),
        type,
        category,
        description: pick(DESCRIPTIONS[category] ?? [category]),
        amount: rand(min, max),
    };
}

export function generateTransactions() {
    _id = 1;
    const today = new Date(2026, 3, 2);
    const transactions = [];

    for (let day = 0; day < 60; day++) {
        const date = subDays(today, day);
        const dayOfMonth = date.getDate();

        // Monthly salary on the 1st
        if (dayOfMonth === 1) {
            transactions.push(makeTransaction(date, 'income', 'Salary'));
        }

        // Periodic freelance / investment income (every ~10 days)
        if (day % 10 === 3) {
            transactions.push(makeTransaction(date, 'income', pick(['Freelance', 'Investment Returns', 'Side Project'])));
        }

        // 1–3 expense transactions per day
        const numExpenses = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < numExpenses; i++) {
            transactions.push(makeTransaction(date, 'expense', pick(EXPENSE_CATEGORIES)));
        }
    }

    // Sort oldest → newest
    transactions.sort((a, b) => new Date(a.date) - new Date(b.date));

    return transactions;
}

export const transactions = generateTransactions();

export const CATEGORY_COLORS = {
    Food: '#f97316',
    Transport: '#3b82f6',
    Shopping: '#ec4899',
    Healthcare: '#10b981',
    Entertainment: '#06b6d4',
    Utilities: '#8b5cf6',
    Salary: '#22c55e',
    Freelance: '#84cc16',
    'Investment Returns': '#a78bfa',
    'Side Project': '#38bdf8',
};
