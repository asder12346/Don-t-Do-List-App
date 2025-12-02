
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from '../../components/icons';

const HeroAnimation: React.FC = () => {
  const items = [
    { text: "Doom Scrolling", width: "w-3/4" },
    { text: "Procrastinating", width: "w-full" },
    { text: "Overthinking", width: "w-5/6" },
  ];

  return (
    <div className="relative w-64 md:w-80 mx-auto mb-10 p-6 bg-white dark:bg-bg-dark-secondary rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Header decoration */}
        <div className="flex items-center space-x-2 mb-6 opacity-50">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>

        {/* List Items */}
        <div className="space-y-4">
            {items.map((item, i) => (
                <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.2 + 0.5 }}
                    className="relative flex items-center"
                >
                    <div className={`h-2 bg-gray-200 dark:bg-gray-600 rounded ${item.width} relative overflow-hidden`}>
                        {/* Text representation (invisible but semantic) */}
                        <span className="sr-only">{item.text}</span>
                        
                        {/* Simulated Text Lines */}
                         <div className="absolute top-0 left-0 h-full w-full bg-gray-300 dark:bg-gray-500 opacity-30" />
                    </div>
                    
                    {/* Strikethrough Animation */}
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ delay: i * 0.6 + 1.5, duration: 0.4, ease: "easeInOut" }}
                        className="absolute left-0 top-1/2 h-0.5 bg-danger z-10"
                        style={{ transform: "translateY(-50%)" }}
                    />

                    {/* Fading text label for context */}
                    <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.2 + 0.5 }}
                        className="absolute left-0 -top-4 text-xs text-gray-400 dark:text-gray-500 font-mono"
                    >
                        {item.text}
                    </motion.span>
                </motion.div>
            ))}
        </div>

        {/* Final "Clean" State Overlay */}
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4, duration: 1 }}
            className="absolute inset-0 bg-white/90 dark:bg-bg-dark-secondary/90 flex flex-col items-center justify-center backdrop-blur-sm"
        >
             <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 4.2, type: "spring" }}
                className="text-primary-light dark:text-primary-dark"
             >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
             </motion.div>
             <motion.p 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 4.4 }}
                className="mt-2 text-sm font-bold text-gray-800 dark:text-white"
            >
                Do Less. Be More.
             </motion.p>
        </motion.div>
    </div>
  );
};

export const WelcomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark flex flex-col items-center justify-center text-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <HeroAnimation />
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">
          Welcome to Don't Do
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-light dark:text-muted-dark max-w-xl mx-auto">
          The simple, effective way to break bad habits, regain focus, and build a more intentional life by focusing on what <i>not</i> to do.
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
