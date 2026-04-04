import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency, TRANSLATIONS } from '../../utils/helpers';
import useStore from '../../store/useStore';

function Card({ label, value, icon: Icon, colorClass, bgClass }) {
    return (
        <div className={`
            flex items-center gap-4 rounded-2xl p-5 shadow-sm border 
            transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group
            ${bgClass}
        `}>
            <div className={`p-3 rounded-xl shrink-0 transition-transform duration-300 group-hover:scale-110 ${colorClass}`}>
                <Icon size={22} strokeWidth={2} className="text-white" />
            </div>
            <div className="min-w-0">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white truncate">{value}</p>
            </div>
        </div>
    );
}

export default function SummaryCards({ transactions }) {
    const language = useStore((s) => s.language);
    const T = TRANSLATIONS[language] || TRANSLATIONS.en;

    const totalIncome = transactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;

    const cards = [
        {
            label: T.balance,
            value: formatCurrency(balance),
            icon: Wallet,
            colorClass: 'bg-indigo-500',
            bgClass: 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800',
        },
        {
            label: T.income,
            value: formatCurrency(totalIncome),
            icon: TrendingUp,
            colorClass: 'bg-green-500',
            bgClass: 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800',
        },
        {
            label: T.expenses,
            value: formatCurrency(totalExpenses),
            icon: TrendingDown,
            colorClass: 'bg-red-500',
            bgClass: 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {cards.map((card) => (
                <Card key={card.label} {...card} />
            ))}
        </div>
    );
}
