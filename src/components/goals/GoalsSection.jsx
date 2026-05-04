import { useMemo, useState } from 'react';
import { Target, Plus, Trash2, Edit2, Calendar, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../../store/useStore';
import { formatCurrency } from '../../utils/helpers';
import { calculateBalanceForecast } from '../../utils/prediction';

export default function GoalsSection() {
    const { goals, transactions, addGoal, deleteGoal, updateGoal } = useStore();
    const [showAdd, setShowAdd] = useState(false);
    const [newGoal, setNewGoal] = useState({ name: '', targetAmount: '', currentAmount: '', color: '#0d9488' });

    // Calculate daily savings rate from last 3 months
    const savingsStats = useMemo(() => {
        const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
        const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
        const currentBalance = totalIncome - totalExpenses;
        
        const forecast = calculateBalanceForecast(transactions, currentBalance);
        const monthlySavings = forecast.expectedSavings;
        const dailySavings = monthlySavings / 30;
        
        return { monthlySavings, dailySavings };
    }, [transactions]);

    const handleAddGoal = (e) => {
        e.preventDefault();
        if (!newGoal.name || !newGoal.targetAmount) return;
        addGoal({
            ...newGoal,
            id: Date.now().toString(),
            targetAmount: Number(newGoal.targetAmount),
            currentAmount: Number(newGoal.currentAmount || 0),
        });
        setNewGoal({ name: '', targetAmount: '', currentAmount: '', color: '#0d9488' });
        setShowAdd(false);
    };

    return (
        <div className="space-y-6 pb-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Financial Goals</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Track your progress towards big milestones.</p>
                </div>
                <button
                    onClick={() => setShowAdd(!showAdd)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all shadow-sm active:scale-95"
                >
                    <Plus size={18} />
                    Add Goal
                </button>
            </div>

            <AnimatePresence>
                {showAdd && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm mb-6">
                            <form onSubmit={handleAddGoal} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                <div className="md:col-span-1">
                                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Goal Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. New Car"
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                        value={newGoal.name}
                                        onChange={e => setNewGoal({...newGoal, name: e.target.value})}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Target (₹)</label>
                                    <input
                                        type="number"
                                        placeholder="100000"
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                        value={newGoal.targetAmount}
                                        onChange={e => setNewGoal({...newGoal, targetAmount: e.target.value})}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Saved So Far (₹)</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                        value={newGoal.currentAmount}
                                        onChange={e => setNewGoal({...newGoal, currentAmount: e.target.value})}
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button type="submit" className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-indigo-700 transition-colors">
                                        Save Goal
                                    </button>
                                    <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goals.map((goal, index) => {
                    const remaining = goal.targetAmount - goal.currentAmount;
                    const percent = Math.min(100, Math.max(0, (goal.currentAmount / goal.targetAmount) * 100));
                    const daysRemaining = savingsStats.dailySavings > 0 
                        ? Math.ceil(remaining / savingsStats.dailySavings) 
                        : null;

                    return (
                        <motion.div 
                            key={goal.id} 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm group hover:shadow-md transition-all"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="p-3 rounded-2xl" style={{ backgroundColor: `${goal.color}20`, color: goal.color }}>
                                    <Target size={24} />
                                </div>
                                <button 
                                    onClick={() => deleteGoal(goal.id)}
                                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">{goal.name}</h3>
                                    <p className="text-sm text-gray-500">
                                        {formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}
                                    </p>
                                </div>

                                <div className="relative h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                    <div 
                                        className="absolute top-0 left-0 h-full transition-all duration-1000 ease-out rounded-full"
                                        style={{ width: `${percent}%`, backgroundColor: goal.color }}
                                    />
                                </div>

                                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider">
                                    <span className="text-gray-400">{percent.toFixed(0)}% reached</span>
                                    <span style={{ color: goal.color }}>{formatCurrency(remaining)} left</span>
                                </div>

                                <div className="pt-4 border-t border-gray-50 dark:border-gray-800 flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400">
                                        <Calendar size={14} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">Estimated Time</p>
                                        <p className="text-sm font-bold text-gray-700 dark:text-gray-200">
                                            {daysRemaining 
                                                ? `${daysRemaining} days remaining` 
                                                : savingsStats.dailySavings <= 0 
                                                    ? 'Increase savings to reach' 
                                                    : 'Calculating...'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}

                {goals.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-gray-50 dark:bg-gray-800/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                        <Target size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">No goals yet</h3>
                        <p className="text-sm text-gray-500 mb-6">Start saving for something big!</p>
                        <button 
                            onClick={() => setShowAdd(true)}
                            className="text-indigo-600 font-bold hover:underline"
                        >
                            Create your first goal
                        </button>
                    </div>
                )}
            </div>
            
            {savingsStats.monthlySavings > 0 && (
                <div className="bg-indigo-600 rounded-3xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp size={20} className="text-indigo-200" />
                            <span className="text-xs font-bold uppercase tracking-widest text-indigo-100">Savings Power</span>
                        </div>
                        <h2 className="text-2xl font-bold mb-1">
                            You're saving {formatCurrency(savingsStats.monthlySavings)} every month
                        </h2>
                        <p className="text-indigo-100 text-sm opacity-80">
                            Based on your last 3 months of activity. Keep it up!
                        </p>
                    </div>
                    <div className="relative z-10 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10">
                        <p className="text-xs font-bold uppercase text-indigo-100 mb-1">Daily Pace</p>
                        <p className="text-3xl font-black">{formatCurrency(savingsStats.dailySavings)}</p>
                    </div>
                    
                    {/* Decorative circles */}
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute -left-10 -top-10 w-40 h-40 bg-indigo-400/20 rounded-full blur-3xl"></div>
                </div>
            )}
        </div>
    );
}
