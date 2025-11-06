
import React from 'react';
import { Layout } from '../components/Layout';
import { UsersIcon } from '../components/icons';

export const CommunityPage: React.FC = () => {
    return (
        <Layout>
            <div className="p-4 md:p-8 flex flex-col items-center justify-center text-center h-full">
                <div className="max-w-md">
                    <UsersIcon className="w-24 h-24 text-primary-light dark:text-primary-dark mx-auto mb-6" />
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Community Hub Coming Soon!</h1>
                    <p className="text-muted-light dark:text-muted-dark mt-4 text-lg">
                        Soon you'll be able to connect with others, share your progress, and join accountability groups. Stay tuned!
                    </p>
                </div>
            </div>
        </Layout>
    );
};
