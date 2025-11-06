import React from 'react';
import { NavLink } from 'react-router-dom';
import { ClockIcon, ChartBarIcon, CogIcon, SparklesIcon, HomeIcon } from './icons';

interface LayoutProps {
    children: React.ReactNode;
}

const navItems = [
    { path: "/home", icon: HomeIcon, label: "Dashboard" },
    { path: "/analytics", icon: ChartBarIcon, label: "Analytics" },
    { path: "/focus", icon: ClockIcon, label: "Focus" },
    { path: "/ai-coach", icon: SparklesIcon, label: "AI Coach" },
    { path: "/settings", icon: CogIcon, label: "Settings" },
];

const BottomNav: React.FC = () => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-bg-dark-secondary border-t border-gray-200 dark:border-gray-700 flex justify-around items-center md:hidden">
            {navItems.map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                        `flex flex-col items-center justify-center w-full text-xs transition-colors duration-200 ${
                            isActive
                                ? 'text-primary-light dark:text-primary-dark'
                                : 'text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark'
                        }`
                    }
                >
                    <item.icon className="w-6 h-6 mb-1" />
                    <span>{item.label}</span>
                </NavLink>
            ))}
        </nav>
    );
};


const SideNav: React.FC = () => {
    return (
        <nav className="hidden md:flex flex-col w-64 bg-white dark:bg-bg-dark-secondary border-r border-gray-200 dark:border-gray-700 p-4">
             <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-8">Don't Do</h1>
            {navItems.map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                        `flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${
                            isActive
                                ? 'bg-primary-light/20 text-primary-light dark:bg-primary-dark/20 dark:text-primary-dark'
                                : 'text-muted-light dark:text-muted-dark hover:bg-gray-100 dark:hover:bg-slate-700'
                        }`
                    }
                >
                    <item.icon className="w-6 h-6 mr-3" />
                    <span>{item.label}</span>
                </NavLink>
            ))}
        </nav>
    )
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-bg-light dark:bg-bg-dark text-gray-900 dark:text-gray-100 flex">
            <SideNav />
            <main className="flex-1 pb-16 md:pb-0">
                {children}
            </main>
            <BottomNav />
        </div>
    );
};