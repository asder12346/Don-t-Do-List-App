
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRightIcon } from '../../components/icons';

// --- Animated Visual Components ---

const HabitsAnimation: React.FC = () => {
    return (
        <div className="relative w-48 h-48 bg-gray-50 dark:bg-slate-800 rounded-2xl overflow-hidden shadow-inner border border-gray-200 dark:border-gray-700">
            {/* Infinite Scrolling Feed */}
            <motion.div
                animate={{ y: [-20, -180] }}
                transition={{ duration: 2, ease: "linear", repeat: Infinity }}
                className="absolute inset-x-4 top-0 space-y-3 pt-6"
            >
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <motion.div 
                        key={i} 
                        className="flex items-center space-x-3 p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm opacity-60"
                        animate={{ x: [0, -2, 2, -2, 2, 0] }} // Subtle shake to simulate instability
                        transition={{ 
                            duration: 0.4, 
                            delay: 1.5, // Shake right before the stomp
                            repeat: Infinity,
                            repeatDelay: 2
                        }}
                    >
                         <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600" />
                         <div className="space-y-1 flex-1">
                             <div className="h-2 w-3/4 bg-gray-200 dark:bg-gray-600 rounded" />
                             <div className="h-2 w-1/2 bg-gray-200 dark:bg-gray-600 rounded" />
                         </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* The "Don't" Intervention Overlay - Slam/Shatter Effect */}
            <motion.div
                initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                animate={{ opacity: [0, 1, 1, 0], backdropFilter: ["blur(0px)", "blur(4px)", "blur(4px)", "blur(0px)"] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 0, times: [0, 0.1, 0.9, 1] }}
                className="absolute inset-0 bg-black/10 dark:bg-black/40 z-10 flex items-center justify-center"
            >
                <motion.div
                    initial={{ scale: 3, rotate: -45, opacity: 0 }}
                    animate={{ scale: [3, 0.9, 1], rotate: [ -45, 0, 0 ], opacity: 1 }}
                    transition={{ 
                        duration: 3, 
                        times: [0, 0.2, 1], 
                        repeat: Infinity, 
                        repeatDelay: 0 
                    }}
                    className="w-16 h-16 bg-danger text-white rounded-full flex items-center justify-center shadow-2xl"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                </motion.div>
            </motion.div>
        </div>
    );
};

const FocusAnimation: React.FC = () => {
    return (
        <div className="relative w-48 h-48 flex items-center justify-center bg-gray-50 dark:bg-slate-800 rounded-2xl overflow-hidden shadow-inner border border-gray-200 dark:border-gray-700">
             {/* Main Focus Orb */}
             <motion.div
                animate={{ 
                    scale: [1, 1.15, 1],
                    boxShadow: [
                        "0 0 0 0px rgba(45, 212, 191, 0)",
                        "0 0 0 15px rgba(45, 212, 191, 0.15)",
                        "0 0 0 25px rgba(45, 212, 191, 0)"
                    ]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 bg-primary-light dark:bg-primary-dark rounded-full z-10 relative"
             >
                <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-pulse" />
             </motion.div>

             {/* Distractions being absorbed with spiral/spin */}
             {[0, 72, 144, 216, 288].map((angle, i) => (
                 <motion.div
                    key={i}
                    initial={{ opacity: 0, x: Math.cos(angle * (Math.PI / 180)) * 80, y: Math.sin(angle * (Math.PI / 180)) * 80 }}
                    animate={{ 
                        opacity: [0, 1, 0],
                        x: [Math.cos(angle * (Math.PI / 180)) * 80, 0],
                        y: [Math.sin(angle * (Math.PI / 180)) * 80, 0],
                        scale: [1, 1, 0.1],
                        rotate: [0, 180] // Spin as they get absorbed
                    }}
                    transition={{ 
                        duration: 2.5, 
                        repeat: Infinity, 
                        delay: i * 0.6,
                        ease: "easeInOut"
                    }}
                    className="absolute w-3 h-3 bg-accent-yellow rounded-full shadow-sm"
                 />
             ))}
        </div>
    );
};

const AwarenessAnimation: React.FC = () => {
    return (
        <div className="relative w-48 h-48 bg-gray-50 dark:bg-slate-800 rounded-2xl p-6 shadow-inner border border-gray-200 dark:border-gray-700 flex flex-col justify-center">
            <h3 className="text-xs font-bold text-muted-light dark:text-muted-dark mb-3 uppercase tracking-wider text-center">Daily Avoidance</h3>
            <div className="grid grid-cols-4 gap-2">
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={i}
                        className={`aspect-square rounded-md flex items-center justify-center relative bg-gray-200 dark:bg-slate-700`}
                    >
                         {/* Checkmark Animation with Flourish */}
                         <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ 
                                opacity: i < 7 ? 1 : 0, 
                                scale: i < 7 ? [0, 1.4, 1] : 0,
                                backgroundColor: i < 7 ? "#10b981" : "transparent"
                            }}
                            transition={{ 
                                delay: i * 0.15 + 0.5, 
                                duration: 0.4,
                                times: [0, 0.6, 1]
                            }}
                            className="w-full h-full rounded-md flex items-center justify-center"
                         >
                            {i < 7 && (
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <motion.path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        d="M5 13l4 4L19 7" 
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ delay: i * 0.15 + 0.7, duration: 0.2 }}
                                    />
                                </svg>
                            )}
                         </motion.div>
                    </motion.div>
                ))}
            </div>
             <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 2, type: "spring" }}
                className="mt-3 text-center"
            >
                <span className="text-xs font-bold text-white bg-gradient-to-r from-primary-light to-primary-dark px-3 py-1 rounded-full shadow-md">
                    7 Day Streak! 🔥
                </span>
            </motion.div>
        </div>
    );
};

// --- Main Component ---

const benefits = [
  {
    Animation: HabitsAnimation,
    title: 'Disrupt Bad Habits',
    description: 'Break the cycle of distraction by actively tracking what you want to avoid.',
  },
  {
    Animation: FocusAnimation,
    title: 'Regain Your Focus',
    description: 'Clear the noise and dedicate uninterrupted time to your most important goals.',
  },
  {
    Animation: AwarenessAnimation,
    title: 'Build Self-Awareness',
    description: "Visualize your discipline and celebrate the days you stayed on track.",
  }
];

export const BenefitsPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < benefits.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const CurrentAnimation = benefits[currentStep].Animation;

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="relative h-80 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <div className="mb-8">
                <CurrentAnimation />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">{benefits[currentStep].title}</h2>
              <p className="text-muted-light dark:text-muted-dark leading-relaxed px-4">{benefits[currentStep].description}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center space-x-2 my-8">
          {benefits.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`h-2 rounded-full transition-all duration-300 ${currentStep === index ? 'w-8 bg-primary-light dark:bg-primary-dark' : 'w-2 bg-gray-300 dark:bg-slate-600'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {currentStep < benefits.length - 1 ? (
          <button
            onClick={nextStep}
            className="w-full inline-flex items-center justify-center px-6 py-4 font-semibold text-white bg-primary-light dark:bg-primary-dark rounded-xl shadow-lg hover:opacity-90 hover:scale-[1.02] transition-all"
          >
            Next
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </button>
        ) : (
          <Link
            to="/onboarding/auth"
            className="w-full inline-flex items-center justify-center px-6 py-4 font-semibold text-white bg-primary-light dark:bg-primary-dark rounded-xl shadow-lg hover:opacity-90 hover:scale-[1.02] transition-all"
          >
            Continue
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </Link>
        )}
      </div>
    </div>
  );
};
