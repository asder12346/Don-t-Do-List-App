import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TargetIcon, BrainIcon, CheckCircleIcon, ArrowRightIcon } from '../../components/icons';

const benefits = [
  {
    icon: TargetIcon,
    title: 'Disrupt Bad Habits',
    description: 'Actively track things you want to avoid, making it easier to break cycles of distraction and procrastination.',
  },
  {
    icon: BrainIcon,
    title: 'Regain Your Focus',
    description: 'Use the built-in focus timer to dedicate uninterrupted time to your most important tasks.',
  },
  {
    icon: CheckCircleIcon,
    title: 'Build Self-Awareness',
    description: "Visualize your progress, understand your patterns, and celebrate your wins on the journey to self-improvement.",
  }
];

export const BenefitsPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < benefits.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  // FIX: Dynamic components must be capitalized.
  const BenefitIcon = benefits[currentStep].icon;

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="relative h-64">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <div className="w-20 h-20 bg-primary-light/10 dark:bg-primary-dark/10 rounded-full flex items-center justify-center mb-6">
                <BenefitIcon className="w-12 h-12 text-primary-light dark:text-primary-dark" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{benefits[currentStep].title}</h2>
              <p className="mt-2 text-muted-light dark:text-muted-dark">{benefits[currentStep].description}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center space-x-2 my-8">
          {benefits.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`w-3 h-3 rounded-full transition-colors ${currentStep === index ? 'bg-primary-light dark:bg-primary-dark' : 'bg-gray-300 dark:bg-slate-600'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {currentStep < benefits.length - 1 ? (
          <button
            onClick={nextStep}
            className="w-full inline-flex items-center justify-center px-6 py-3 font-semibold text-white bg-primary-light dark:bg-primary-dark rounded-lg shadow-md hover:opacity-90 transition-opacity"
          >
            Next
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </button>
        ) : (
          <Link
            to="/onboarding/auth"
            className="w-full inline-flex items-center justify-center px-6 py-3 font-semibold text-white bg-primary-light dark:bg-primary-dark rounded-lg shadow-md hover:opacity-90 transition-opacity"
          >
            Continue
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </Link>
        )}
      </div>
    </div>
  );
};