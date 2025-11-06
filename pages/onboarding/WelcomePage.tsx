import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from '../../components/icons';

export const WelcomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark flex flex-col items-center justify-center text-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">
          Welcome to Don't Do
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-light dark:text-muted-dark max-w-xl mx-auto">
          The simple, effective way to break bad habits, regain focus, and build a more intentional life by focusing on what not to do.
        </p>
        <Link
          to="/onboarding/benefits"
          className="mt-10 inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-primary-light dark:bg-primary-dark rounded-full shadow-lg hover:scale-105 transition-transform"
        >
          Get Started
          <ArrowRightIcon className="w-6 h-6 ml-3" />
        </Link>
      </motion.div>
    </div>
  );
};
