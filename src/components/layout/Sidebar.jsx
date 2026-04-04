import { LayoutDashboard, ArrowLeftRight, Lightbulb } from 'lucide-react';
import useStore from '../../store/useStore';
import { TRANSLATIONS } from '../../utils/helpers';

const NAV_ITEMS = [
    { id: 'dashboard', icon: LayoutDashboard },
    { id: 'transactions', icon: ArrowLeftRight },
    { id: 'insights', icon: Lightbulb },
];

export default function Sidebar() {
    const activePage = useStore((s) => s.activePage);
    const setActivePage = useStore((s) => s.setActivePage);
    const language = useStore((s) => s.language);

    const T = TRANSLATIONS[language] || TRANSLATIONS.en;

    return (
        <aside className="hidden md:flex flex-col w-60 shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-300">

            <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-100 dark:border-gray-800">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">Z</span>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                    Zorvyn
                </span>
            </div>

            <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
                {NAV_ITEMS.map(({ id, icon: Icon }) => {
                    const isActive = activePage === id;
                    return (
                        <button
                            key={id}
                            onClick={() => setActivePage(id)}
                            className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium w-full text-left
                        transition-all duration-150
                        ${isActive
                                    ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                                }
                      `}
                        >
                            <Icon
                                size={18}
                                className={isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500'}
                            />
                            {T[id]}
                        </button>
                    );
                })}
            </nav>

            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800">
                <p className="text-xs text-gray-400 dark:text-gray-600">Zorvyn</p>
            </div>
        </aside>
    );
}
