import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AuthButton: React.FC<{ children: React.ReactNode; className: string; }> = ({ children, className }) => (
    <button className={`w-full py-3 px-4 rounded-lg font-semibold transition-opacity hover:opacity-90 ${className}`}>
        {children}
    </button>
);

export const AuthPlaceholderPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm text-center"
      >
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Create Your Account
        </h1>
        <p className="mt-2 text-muted-light dark:text-muted-dark">
          (This is a placeholder UI)
        </p>

        <div className="space-y-4 mt-8">
            <AuthButton className="bg-blue-500 text-white">Sign up with Google</AuthButton>
            <AuthButton className="bg-black text-white dark:bg-white dark:text-black">Sign up with Apple</AuthButton>
            <AuthButton className="bg-gray-200 text-gray-800 dark:bg-slate-700 dark:text-white">Sign up with Email</AuthButton>
        </div>

        <div className="mt-6">
            <Link to="/onboarding/first-task" className="text-primary-light dark:text-primary-dark hover:underline font-semibold">
                Skip for now
            </Link>
        </div>
      </motion.div>
    </div>
  );
};
