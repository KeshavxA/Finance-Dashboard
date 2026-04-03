import useStore from '../../store/useStore';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ children }) {
    const darkMode = useStore((s) => s.darkMode);

    return (
        <div className={darkMode ? 'dark' : ''}>
            <div className="flex h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">

                <Sidebar />

                <div className="flex flex-col flex-1 min-w-0">
                    <Header />
                    <main className="flex-1 overflow-y-auto p-4 md:p-6">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
