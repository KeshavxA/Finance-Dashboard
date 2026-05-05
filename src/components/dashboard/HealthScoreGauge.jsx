import { motion } from 'framer-motion';
import { ShieldCheck, Info } from 'lucide-react';
import { getScoreRating } from '../../utils/healthScore';

export default function HealthScoreGauge({ scoreData }) {
    const { score } = scoreData;
    const rating = getScoreRating(score);
    
    // SVG Path for the arc
    const size = 180;
    const strokeWidth = 14;
    const center = size / 2;
    const radius = center - strokeWidth;
    const circumference = 2 * Math.PI * radius;
    
    // We only want a semi-circle (half arc)
    const arcLength = circumference / 2;
    const strokeDashoffset = arcLength - (score / 100) * arcLength;

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
            <div className="w-full flex items-center justify-between mb-2">
                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">Wealth Score</h2>
                <div className="group relative">
                    <Info size={14} className="text-gray-300 cursor-help" />
                    <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-gray-800 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                        Based on your savings rate, goal progress, and spending stability.
                    </div>
                </div>
            </div>

            <div className="relative flex items-center justify-center pt-4">
                <svg width={size} height={size / 1.5} className="transform -rotate-0">
                    {/* Background Arc */}
                    <path
                        d={`M ${strokeWidth},${size / 1.5} A ${radius},${radius} 0 0 1 ${size - strokeWidth},${size / 1.5}`}
                        fill="none"
                        stroke="currentColor"
                        className="text-gray-100 dark:text-gray-800"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                    />
                    {/* Progress Arc */}
                    <motion.path
                        initial={{ strokeDashoffset: arcLength }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                        d={`M ${strokeWidth},${size / 1.5} A ${radius},${radius} 0 0 1 ${size - strokeWidth},${size / 1.5}`}
                        fill="none"
                        stroke={rating.color}
                        strokeWidth={strokeWidth}
                        strokeDasharray={arcLength}
                        strokeLinecap="round"
                    />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center translate-y-4">
                    <motion.span 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1, duration: 0.5 }}
                        className="text-4xl font-black text-gray-900 dark:text-white"
                    >
                        {score}
                    </motion.span>
                    <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                        className="text-[10px] font-bold uppercase tracking-widest"
                        style={{ color: rating.color }}
                    >
                        {rating.label}
                    </motion.span>
                </div>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="mt-2 text-center"
            >
                <p className="text-[11px] text-gray-500 dark:text-gray-400 max-w-[160px] leading-relaxed">
                    {rating.message}
                </p>
            </motion.div>

            {/* Subtle background icon */}
            <ShieldCheck size={100} className="absolute -bottom-6 -right-6 text-gray-50 dark:text-gray-800/20 -z-10 rotate-12" />
        </div>
    );
}
