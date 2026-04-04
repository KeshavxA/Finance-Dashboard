import {
    Sun, Moon,
    Eye, Shield,
    LayoutDashboard, ArrowLeftRight, Lightbulb,
    Languages,
} from 'lucide-react';
import useStore from '../../store/useStore';
import { TRANSLATIONS } from '../../utils/helpers';

const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
    { id: 'insights', label: 'Insights', icon: Lightbulb },
];

const LANGUAGES = [
    { id: 'en', label: 'English', flag: '🇺🇸' },
    { id: 'hi', label: 'Hindi', flag: '🇮🇳' },
    { id: 'es', label: 'Spanish', flag: '🇪🇸' },
    { id: 'nl', label: 'Dutch', flag: '🇳🇱' },
];

function LanguageSwitcher({ language, setLanguage, className = "" }) {
    return (
        <div className={`relative flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-2.5 py-1.5 ${className}`}>
            <Languages size={15} className="text-gray-500 dark:text-gray-400" />
            <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer outline-none appearance-none pr-1 focus:ring-0 border-none"
            >
                {LANGUAGES.map((l) => (
                    <option key={l.id} value={l.id} className="dark:bg-gray-900">
                        {l.flag} {l.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default function Header() {
    const activePage = useStore((s) => s.activePage);
    const role = useStore((s) => s.role);
    const setRole = useStore((s) => s.setRole);
    const darkMode = useStore((s) => s.darkMode);
    const toggleDarkMode = useStore((s) => s.toggleDarkMode);
    const language = useStore((s) => s.language);
    const setLanguage = useStore((s) => s.setLanguage);

    const T = TRANSLATIONS[language] || TRANSLATIONS.en;

    return (
        <>
            <header className="hidden md:flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm shrink-0">
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {T[activePage]}
                </h1>

                <div className="flex items-center gap-3">
                    <div className="relative flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-1.5">
                        {role === 'viewer'
                            ? <Eye size={15} className="text-gray-500 dark:text-gray-400" />
                            : <Shield size={15} className="text-indigo-500" />
                        }
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="bg-transparent text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer outline-none appearance-none pr-1"
                        >
                            <option value="viewer" className="dark:bg-gray-900">Viewer</option>
                            <option value="admin" className="dark:bg-gray-900">Admin</option>
                        </select>
                    </div>

                    <LanguageSwitcher
                        language={language}
                        setLanguage={setLanguage}
                    />

                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Toggle dark mode"
                    >
                        {darkMode
                            ? <Sun size={17} className="text-yellow-400" />
                            : <Moon size={17} className="text-gray-500" />
                        }
                    </button>
                </div>
            </header>

            <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shrink-0">
                <div className="flex items-center gap-2 shrink-0">
                    <div className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">F</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar-hide">
                    <div className="relative flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg px-2.5 py-1.5">
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="bg-transparent text-xs font-medium text-gray-700 dark:text-gray-300 cursor-pointer outline-none appearance-none"
                        >
                            <option value="viewer" className="dark:bg-gray-900">Viewer</option>
                            <option value="admin" className="dark:bg-gray-900">Admin</option>
                        </select>
                    </div>

                    <LanguageSwitcher
                        language={language}
                        setLanguage={setLanguage}
                        className="!gap-1 !px-2"
                    />

                    <button
                        onClick={toggleDarkMode}
                        className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shrink-0"
                        aria-label="Toggle dark mode"
                    >
                        {darkMode
                            ? <Sun size={15} className="text-yellow-400" />
                            : <Moon size={15} className="text-gray-500" />
                        }
                    </button>
                </div>
            </header>

            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg">
                {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
                    const isActive = activePage === id;
                    return (
                        <button
                            key={id}
                            onClick={() => useStore.getState().setActivePage(id)}
                            className={`
                                flex flex-col items-center justify-center flex-1 py-2.5 gap-1 text-xs font-medium
                                transition-colors duration-150
                                ${isActive
                                    ? 'text-indigo-600 dark:text-indigo-400'
                                    : 'text-gray-400 dark:text-gray-500'
                                }
                            `}
                        >
                            <Icon size={20} />
                            <span>{T[id]}</span>
                        </button>
                    );
                })}
            </nav>
        </>
    );
}
