import { format, parseISO, startOfMonth, subMonths } from 'date-fns';

/**
 * Predicts the balance at the end of the next month.
 * Uses weighted average of net savings from the last 3 months.
 */
export function calculateBalanceForecast(transactions, currentBalance) {
    if (!transactions || transactions.length === 0) return currentBalance;

    const monthlySavings = {};
    const today = new Date(2026, 3, 2); // Matching InsightsSection TODAY

    // Last 3 months keys
    const last3Months = [0, 1, 2].map(i => 
        format(startOfMonth(subMonths(today, i)), 'yyyy-MM')
    );

    // Initialize
    last3Months.forEach(m => monthlySavings[m] = 0);

    // Calculate net savings per month
    transactions.forEach(t => {
        const monthKey = format(startOfMonth(parseISO(t.date)), 'yyyy-MM');
        if (monthlySavings.hasOwnProperty(monthKey)) {
            if (t.type === 'income') monthlySavings[monthKey] += t.amount;
            else monthlySavings[monthKey] -= t.amount;
        }
    });

    const savingsValues = last3Months.map(m => monthlySavings[m]);
    
    // Weighted average: Recent months have more impact
    // Month 0 (current): 0.5
    // Month 1 (last): 0.3
    // Month 2 (before): 0.2
    const weights = [0.5, 0.3, 0.2];
    let weightedSavings = 0;
    let totalWeight = 0;

    savingsValues.forEach((val, i) => {
        weightedSavings += val * weights[i];
        totalWeight += weights[i];
    });

    const averageSavings = totalWeight > 0 ? weightedSavings / totalWeight : 0;
    
    return {
        predictedBalance: currentBalance + averageSavings,
        expectedSavings: averageSavings,
        isPositive: averageSavings > 0
    };
}
