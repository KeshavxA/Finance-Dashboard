import { LayoutDashboard, ArrowLeftRight, Lightbulb } from 'lucide-react';
import useStore from '../../store/useStore';
import { TRANSLATIONS } from '../../utils/helpers';
import logoLight from '../../assets/logo-light.png';
import logoDark from '../../assets/logo-dark.png';

const NAV_ITEMS = [
    { id: 'dashboard', icon: LayoutDashboard },
    { id: 'transactions', icon: ArrowLeftRight },
    { id: 'insights', icon: Lightbulb },
];

export default function Sidebar() {
    const activePage = useStore((s) => s.activePage);
    const setActivePage = useStore((s) => s.setActivePage);
    const language = useStore((s) => s.language);
    const darkMode = useStore((s) => s.darkMode);

    const T = TRANSLATIONS[language] || TRANSLATIONS.en;

    return (
        <aside className="hidden md:flex flex-col w-64 shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-300">

            <div className="flex flex-col items-center justify-center px-8 py-10 border-b border-gray-100 dark:border-gray-800">
                <img
                    src={darkMode ? logoDark : logoLight}
                    alt="Zorvyn Logo"
                    className="h-20 w-auto object-contain transition-opacity duration-300"
                />
            </div>

            <nav className="flex flex-col gap-1 px-4 py-6 flex-1">
                {NAV_ITEMS.map(({ id, icon: Icon }) => {
                    const isActive = activePage === id;
                    return (
                        <button
                            key={id}
                            onClick={() => setActivePage(id)}
                            className={`
                        flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-semibold w-full text-left
                        transition-all duration-200
                        ${isActive
                                    ? 'bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-400 shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-100'
                                }
                      `}
                        >
                            <Icon
                                size={20}
                                className={isActive ? 'text-teal-600 dark:text-teal-400' : 'text-gray-400 dark:text-gray-500'}
                            />
                            {T[id]}
                        </button>
                    );
                })}
            </nav>

            <div className="px-6 py-6 border-t border-gray-100 dark:border-gray-800 text-center">
                <p className="text-[10px] text-gray-300 dark:text-gray-600 uppercase tracking-[0.2em] font-black">Zorvyn Fintech</p>
            </div>
        </aside>
    );
}
