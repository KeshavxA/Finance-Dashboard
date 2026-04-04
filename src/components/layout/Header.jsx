import {
    Sun, Moon,
    Eye, Shield,
    LayoutDashboard, ArrowLeftRight, Lightbulb,
    Languages,
} from 'lucide-react';
import useStore from '../../store/useStore';
import { TRANSLATIONS } from '../../utils/helpers';
import logo from '../../assets/logo.png';

const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
    { id: 'insights', icon: Lightbulb },
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
            <header className="hidden md:flex items-center justify-between px-8 py-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm shrink-0">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                    {T[activePage]}
                </h1>

                <div className="flex items-center gap-4">
                    <div className="relative flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-2 border border-gray-100 dark:border-gray-700 shadow-xs">
                        {role === 'viewer'
                            ? <Eye size={16} className="text-gray-500 dark:text-gray-400" />
                            : <Shield size={16} className="text-teal-600" />
                        }
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="bg-transparent text-sm font-bold text-gray-700 dark:text-gray-300 cursor-pointer outline-none appearance-none pr-1"
                        >
                            <option value="viewer" className="dark:bg-gray-900 font-medium text-base">Viewer</option>
                            <option value="admin" className="dark:bg-gray-900 font-medium text-base">Admin</option>
                        </select>
                    </div>

                    <LanguageSwitcher
                        language={language}
                        setLanguage={setLanguage}
                    />

                    <button
                        onClick={toggleDarkMode}
                        className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 border border-gray-100 dark:border-gray-700 shadow-sm"
                        aria-label="Toggle dark mode"
                    >
                        {darkMode
                            ? <Sun size={19} className="text-yellow-400" />
                            : <Moon size={19} className="text-gray-500" />
                        }
                    </button>
                </div>
            </header>

            <header className="md:hidden flex flex-col px-4 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shrink-0 gap-4">
                <div className="flex items-center justify-between">
                    <img src={logo} alt="Zorvyn Logo" className="h-14 w-auto object-contain" />
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shrink-0"
                        aria-label="Toggle dark mode"
                    >
                        {darkMode
                            ? <Sun size={17} className="text-yellow-400" />
                            : <Moon size={17} className="text-gray-500" />
                        }
                    </button>
                </div>

                <div className="flex items-center gap-3 overflow-x-auto custom-scrollbar-hide pb-1">
                    <div className="relative flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 shrink-0 border border-gray-100 dark:border-gray-700 shadow-xs">
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="bg-transparent text-xs font-bold text-gray-700 dark:text-gray-300 cursor-pointer outline-none appearance-none"
                        >
                            <option value="viewer" className="dark:bg-gray-900">Viewer</option>
                            <option value="admin" className="dark:bg-gray-900">Admin</option>
                        </select>
                    </div>

                    <LanguageSwitcher
                        language={language}
                        setLanguage={setLanguage}
                        className="!gap-1.5 !px-3 !py-2 shrink-0 border border-gray-100 dark:border-gray-700 shadow-xs"
                    />
                </div>
            </header>

            <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200 dark:border-gray-800 shadow-2xl rounded-2xl w-[90%] max-w-sm overflow-hidden p-1.5">
                {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
                    const isActive = activePage === id;
                    return (
                        <button
                            key={id}
                            onClick={() => useStore.getState().setActivePage(id)}
                            className={`
                                flex flex-col items-center justify-center flex-1 py-3 rounded-xl gap-1 text-[10px] font-bold uppercase tracking-wider
                                transition-all duration-200
                                ${isActive
                                    ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20'
                                    : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
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
