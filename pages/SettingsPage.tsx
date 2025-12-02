
import React, { useContext, useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { ThemeContext } from '../App';
import { ThemeContextType } from '../types';
import { PageTransition } from '../components/PageTransition';

export const SettingsPage: React.FC = () => {
    const { theme, toggleTheme } = useContext(ThemeContext) as ThemeContextType;
    const [permission, setPermission] = useState('default');

    useEffect(() => {
        if ('Notification' in window) {
            setPermission(Notification.permission);
        }
    }, []);

    const requestNotificationPermission = () => {
        if ('Notification' in window) {
            Notification.requestPermission().then(setPermission);
        } else {
            alert("This browser does not support desktop notifications.");
        }
    };
    
    const sendTestNotification = () => {
        if (permission === 'granted') {
             new Notification("Don't Do List", {
                body: "This is a test notification. Your reminders will appear here.",
                icon: '/vite.svg',
            });
        } else {
            alert("Please enable notifications first.");
        }
    };
    
    const exportData = () => {
        const data = localStorage.getItem('dont-do-list-tasks');
        if (data) {
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'dont-do-list-backup.json';
            a.click();
            URL.revokeObjectURL(url);
        } else {
            alert("No data to export.");
        }
    };

    const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const content = e.target?.result as string;
                    JSON.parse(content);
                    localStorage.setItem('dont-do-list-tasks', content);
                    alert("Data imported successfully! Please refresh the page.");
                } catch (error) {
                    alert("Invalid JSON file.");
                }
            };
            reader.readAsText(file);
        }
    };

    const clearData = () => {
        if (window.confirm("Are you sure you want to delete all your data? This cannot be undone.")) {
            localStorage.removeItem('dont-do-list-tasks');
            alert("All data has been cleared. Please refresh the page.");
        }
    };

    return (
        <Layout>
            <PageTransition>
                <div className="p-4 md:p-8">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Settings</h1>

                    <div className="max-w-2xl mx-auto space-y-8 pb-20">
                        <div className="bg-white dark:bg-bg-dark-secondary p-6 rounded-lg shadow-sm">
                            <h2 className="text-xl font-bold mb-4">Appearance</h2>
                            <div className="flex items-center justify-between">
                                <span className="text-lg">Dark Mode</span>
                                <button onClick={toggleTheme} className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors bg-gray-200 dark:bg-slate-600">
                                    <span className={`${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
                                </button>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-bg-dark-secondary p-6 rounded-lg shadow-sm">
                            <h2 className="text-xl font-bold mb-4">Notifications</h2>
                            <div className="flex items-center justify-between">
                                <span className="text-lg">Browser Reminders</span>
                                <div className="flex items-center space-x-3">
                                    {permission === 'granted' && (
                                        <button onClick={sendTestNotification} className="text-sm font-medium text-primary-light dark:text-primary-dark hover:underline">
                                            Test
                                        </button>
                                    )}
                                    <div>
                                        {permission === 'granted' && <span className="px-3 py-1 text-sm rounded-full bg-success/20 text-success font-semibold">Enabled</span>}
                                        {permission === 'denied' && <span className="px-3 py-1 text-sm rounded-full bg-danger/20 text-danger font-semibold">Disabled</span>}
                                        {permission === 'default' && (
                                            <button onClick={requestNotificationPermission} className="px-4 py-2 rounded-md text-white bg-primary-light dark:bg-primary-dark hover:opacity-90 transition-opacity">
                                                Enable
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-muted-light dark:text-muted-dark mt-3">
                                Enable notifications to get periodic reminders for your tasks and alerts when focus sessions end.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-bg-dark-secondary p-6 rounded-lg shadow-sm">
                            <h2 className="text-xl font-bold mb-4">Data Management</h2>
                            <div className="space-y-4">
                                <button onClick={exportData} className="w-full text-center px-4 py-3 rounded-md text-white bg-primary-light dark:bg-primary-dark hover:opacity-90 transition-opacity">
                                    Export My Data
                                </button>
                                <div>
                                    <label htmlFor="import-data" className="cursor-pointer w-full block text-center px-4 py-3 rounded-md text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-slate-600 hover:bg-gray-300 dark:hover:bg-slate-500 transition-colors">
                                        Import Data
                                    </label>
                                    <input id="import-data" type="file" accept=".json" className="hidden" onChange={importData} />
                                </div>
                                <button onClick={clearData} className="w-full text-center px-4 py-3 rounded-md text-white bg-danger hover:opacity-90 transition-opacity">
                                    Delete All Data
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </PageTransition>
        </Layout>
    );
};
