import { GoogleGenerativeAI } from "@google/generative-ai";

// For local development/demo, users can provide an API key in .env
// VITE_GEMINI_API_KEY=your_key_here
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

/**
 * Generates financial insights using Gemini AI.
 * Falls back to a mock generator if no API key is provided.
 */
export async function getAIWealthInsights(userData) {
    if (!genAI) {
        return getMockInsights(userData);
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are an expert personal wealth advisor. Analyze the following user financial data and provide 3-4 actionable, specific "Power Insights" to improve their financial health.
            
            USER DATA:
            - Monthly Income: ${userData.totalIncome}
            - Monthly Expenses: ${userData.totalExpenses}
            - Top Category: ${userData.topCategory}
            - Savings Rate: ${userData.savingsRate}%
            - Active Goals: ${userData.goals.map(g => `${g.name} (${g.currentAmount}/${g.targetAmount})`).join(', ')}
            - Wealth Score: ${userData.healthScore}/100
            
            GUIDELINES:
            1. Be concise and professional.
            2. Use a "Coach" tone. 
            3. Reference specific goals if possible.
            4. Provide ONE specific "Actionable Task" (e.g., "Cancel one unused subscription").
            5. Return the response as a JSON object with this structure:
               {
                 "summary": "Brief overall assessment",
                 "insights": ["insight 1", "insight 2", "insight 3"],
                 "actionItem": "The specific task",
                 "impact": "Projected outcome of the action"
               }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const jsonStr = text.replace(/```json|```/g, "").trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Gemini AI Error:", error);
        return getMockInsights(userData);
    }
}

function getMockInsights(userData) {

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                summary: `Your Wealth Score of ${userData.healthScore} is solid, but there's room to optimize your ${userData.topCategory} spending.`,
                insights: [
                    `Your current savings rate of ${userData.savingsRate}% is healthy, but increasing it by just 5% would reach your "${userData.goals[0]?.name || 'Financial Goals'}" goal 2 months earlier.`,
                    `Your spending in ${userData.topCategory} accounts for a significant portion of your budget. Diversifying your spending could improve your stability score.`,
                    "Historical data suggests your income is stable; this is a great time to automate a small recurring investment."
                ],
                actionItem: `Audit your ${userData.topCategory} transactions for the last 14 days and identify ₹2,000 in non-essential spending.`,
                impact: "This small shift would fund 15% of your remaining goal targets this month."
            });
        }, 1500);
    });
}
