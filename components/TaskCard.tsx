
import React from 'react';
import { Task, ImpactTier } from '../types';
import { TrashIcon, PencilIcon, CheckCircleIcon } from './icons';
import { motion } from 'framer-motion';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onToggleAvoided: (id: string) => void;
  isAvoidedToday: boolean;
}

const tierColorMap: { [key in ImpactTier]: string } = {
  [ImpactTier.LOW]: 'bg-accent-mint/20 text-accent-mint',
  [ImpactTier.MEDIUM]: 'bg-accent-yellow/20 text-accent-yellow',
  [ImpactTier.HIGH]: 'bg-danger/20 text-danger',
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete, onEdit, onToggleAvoided, isAvoidedToday }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
      className="bg-white dark:bg-bg-dark-secondary rounded-lg shadow-sm p-4 flex items-start space-x-4"
    >
      <button
        onClick={() => onToggleAvoided(task.id)}
        className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-300 ${
          isAvoidedToday ? 'bg-success text-white' : 'border-2 border-gray-300 dark:border-gray-600'
        }`}
        aria-label={isAvoidedToday ? `Mark ${task.name} as not avoided` : `Mark ${task.name} as avoided`}
      >
        {isAvoidedToday && <CheckCircleIcon className="w-7 h-7" />}
      </button>

      <div className="flex-grow">
        <p className={`font-semibold text-lg ${isAvoidedToday ? 'line-through text-muted-light dark:text-muted-dark' : 'text-gray-800 dark:text-gray-100'}`}>
            {task.name}
        </p>
        <div className="flex items-center space-x-2 mt-2 text-sm">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${tierColorMap[task.tier]}`}>
            {task.tier}
          </span>
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-200 dark:bg-gray-700 text-muted-light dark:text-muted-dark">
            {task.category}
          </span>
        </div>
      </div>

      <div className="flex-shrink-0 flex items-center space-x-2">
        <button onClick={() => onEdit(task)} className="p-2 text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark">
          <PencilIcon className="w-5 h-5" />
        </button>
        <button onClick={() => onDelete(task.id)} className="p-2 text-muted-light dark:text-muted-dark hover:text-danger">
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};
