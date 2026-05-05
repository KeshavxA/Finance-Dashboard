import { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, Loader2, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAIWealthInsights } from '../../utils/aiService';

export default function AIAdvisor({ userData }) {
    const [loading, setLoading] = useState(false);
    const [insights, setInsights] = useState(null);

    const handleAnalyze = async () => {
        setLoading(true);
        try {
            const data = await getAIWealthInsights(userData);
            setInsights(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden relative shadow-sm">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            
            <div className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                            <BrainCircuit size={22} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">AI Wealth Intelligence</h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Personalized advisor powered by Google Gemini</p>
                        </div>
                    </div>
                    {!insights && !loading && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleAnalyze}
                            className="px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-sm font-bold shadow-xl transition-all"
                        >
                            Analyze Now
                        </motion.button>
                    )}
                </div>

                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div 
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="py-12 flex flex-col items-center justify-center gap-4"
                        >
                            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                            <p className="text-sm font-medium text-gray-400 animate-pulse">Consulting Gemini AI...</p>
                        </motion.div>
                    ) : insights ? (
                        <motion.div 
                            key="results"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <div className="p-4 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100/50 dark:border-indigo-800/50">
                                <p className="text-sm text-indigo-900 dark:text-indigo-200 italic leading-relaxed">
                                    "{insights.summary}"
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-1">Power Insights</h3>
                                    {insights.insights.map((item, i) => (
                                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-600 dark:text-gray-300">
                                            <Sparkles size={14} className="text-indigo-500 shrink-0 mt-0.5" />
                                            {item}
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-1">Actionable Task</h3>
                                    <div className="p-5 rounded-2xl bg-gray-900 text-white relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
                                            <CheckCircle2 size={40} />
                                        </div>
                                        <p className="text-sm font-bold mb-2 pr-8">{insights.actionItem}</p>
                                        <div className="flex items-center gap-2 text-indigo-400 font-bold text-[10px] uppercase tracking-wider">
                                            <span>Est. Impact</span>
                                            <ArrowRight size={10} />
                                            <span className="text-white">{insights.impact}</span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setInsights(null)}
                                        className="w-full py-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-indigo-500 transition-colors"
                                    >
                                        Re-analyze with new data
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="py-8 text-center bg-gray-50 dark:bg-gray-800/30 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-800">
                            <Sparkles size={32} className="mx-auto text-gray-200 dark:text-gray-700 mb-3" />
                            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                                Click analyze to get high-level financial strategies tailored to your spending habits.
                            </p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
