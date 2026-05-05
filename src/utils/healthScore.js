import { subMonths, format, startOfMonth, parseISO } from 'date-fns';

/**
 * Calculates a financial health score from 0-100.
 * Factors: Savings Rate (40%), Goal Progress (30%), Spending Stability (30%)
 */
export function calculateHealthScore(transactions, goals) {
    if (!transactions || transactions.length === 0) return 0;

    const TODAY = new Date(2026, 3, 2);

    // 1. Savings Rate (40%)
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
    
    let savingsScore = 0;
    if (savingsRate >= 30) savingsScore = 100;
    else if (savingsRate >= 20) savingsScore = 80;
    else if (savingsRate >= 10) savingsScore = 50;
    else if (savingsRate > 0) savingsScore = 20;
    else savingsScore = 0;

    // 2. Goal Consistency (30%)
    let goalScore = 0;
    if (goals && goals.length > 0) {
        const totalProgress = goals.reduce((sum, g) => {
            const p = (g.currentAmount / g.targetAmount) * 100;
            return sum + Math.min(100, p);
        }, 0);
        goalScore = totalProgress / goals.length;
    }

    // 3. Category Diversification (30%)
    // Check if spending is too concentrated in one category
    const categoryTotals = {};
    transactions
        .filter(t => t.type === 'expense')
        .forEach(t => {
            categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
        });
    
    const expenseCategories = Object.values(categoryTotals);
    const totalExp = expenseCategories.reduce((s, v) => s + v, 0);
    const maxCatExp = Math.max(...expenseCategories, 0);
    const maxCatPercent = totalExp > 0 ? (maxCatExp / totalExp) * 100 : 0;

    let diversificationScore = 100;
    if (maxCatPercent >= 70) diversificationScore = 20;
    else if (maxCatPercent >= 50) diversificationScore = 50;
    else if (maxCatPercent >= 35) diversificationScore = 80;
    else diversificationScore = 100;

    // Weighted Final Score
    const finalScore = (savingsScore * 0.4) + (goalScore * 0.3) + (diversificationScore * 0.3);
    
    return {
        score: Math.round(finalScore),
        factors: {
            savings: Math.round(savingsScore),
            goals: Math.round(goalScore),
            diversification: Math.round(diversificationScore)
        }
    };
}

export function getScoreRating(score) {
    if (score >= 80) return { label: 'Excellent', color: '#22c55e', message: 'You are in total control of your finances!' };
    if (score >= 60) return { label: 'Good', color: '#10b981', message: 'You are doing well, keep building your savings.' };
    if (score >= 40) return { label: 'Average', color: '#f59e0b', message: 'Consider reducing discretionary spending.' };
    return { label: 'Needs Focus', color: '#ef4444', message: 'Start by tracking every expense and setting a small goal.' };
}
