

import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
    ClockIcon, ClockIconSolid,
    ChartBarIcon, ChartBarIconSolid,
    CogIcon, CogIconSolid,
    SparklesIcon, SparklesIconSolid,
    HomeIcon, HomeIconSolid
} from './icons';
import { triggerHaptic } from '../utils/haptics';
import { motion } from 'framer-motion';

interface LayoutProps {
    children: React.ReactNode;
}

const navItems = [
    { path: "/home", icon: HomeIcon, activeIcon: HomeIconSolid, label: "Dashboard" },
    { path: "/analytics", icon: ChartBarIcon, activeIcon: ChartBarIconSolid, label: "Analytics" },
    { path: "/focus", icon: ClockIcon, activeIcon: ClockIconSolid, label: "Focus" },
    { path: "/ai-coach", icon: SparklesIcon, activeIcon: SparklesIconSolid, label: "AI Coach" },
    { path: "/settings", icon: CogIcon, activeIcon: CogIconSolid, label: "Settings" },
];

const BottomNav: React.FC = () => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-bg-dark-secondary border-t border-gray-200 dark:border-gray-700 flex justify-around items-center md:hidden z-40">
            {navItems.map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => triggerHaptic(10)}
                    className={({ isActive }) =>
                        `flex flex-col items-center justify-center w-full text-xs transition-colors duration-200 ${
                            isActive
                                ? 'text-primary-light dark:text-primary-dark'
                                : 'text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark'
                        }`
                    }
                >
                    {({ isActive }) => (
                        <>
                            <motion.div
                                initial={false}
                                animate={isActive ? { scale: [0.8, 1.25, 1], rotate: [0, -10, 10, 0] } : { scale: 1, rotate: 0 }}
                                transition={{ duration: 0.4, type: "spring", stiffness: 400, damping: 17 }}
                                className="mb-1"
                            >
                                {isActive ? <item.activeIcon className="w-6 h-6" /> : <item.icon className="w-6 h-6" />}
                            </motion.div>
                            <span>{item.label}</span>
                        </>
                    )}
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
                    onClick={() => triggerHaptic(10)}
                    className={({ isActive }) =>
                        `flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${
                            isActive
                                ? 'bg-primary-light/20 text-primary-light dark:bg-primary-dark/20 dark:text-primary-dark'
                                : 'text-muted-light dark:text-muted-dark hover:bg-gray-100 dark:hover:bg-slate-700'
                        }`
                    }
                >
                    {({ isActive }) => (
                         <>
                            <motion.div
                                initial={false}
                                animate={isActive ? { scale: [0.8, 1.2, 1] } : { scale: 1 }}
                                transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 20 }}
                                className="mr-3"
                            >
                                {isActive ? <item.activeIcon className="w-6 h-6" /> : <item.icon className="w-6 h-6" />}
                            </motion.div>
                            <span>{item.label}</span>
                        </>
                    )}
                </NavLink>
            ))}
        </nav>
    )
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-bg-light dark:bg-bg-dark text-gray-900 dark:text-gray-100 flex overflow-hidden">
            <SideNav />
            <main className="flex-1 pb-16 md:pb-0 h-screen overflow-y-auto">
                {children}
            </main>
            <BottomNav />
        </div>
    );
};