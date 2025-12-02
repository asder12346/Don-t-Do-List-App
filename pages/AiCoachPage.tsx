
import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { useTasks } from '../hooks/useTasks';
import { getAIBasedSuggestion } from '../services/geminiService';
import { Task } from '../types';
import { SparklesIcon } from '../components/icons';
import { motion } from 'framer-motion';
import { PageTransition } from '../components/PageTransition';

export const AiCoachPage: React.FC = () => {
  const { tasks } = useTasks();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [suggestion, setSuggestion] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTaskSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const taskId = event.target.value;
    const task = tasks.find(t => t.id === taskId) || null;
    setSelectedTask(task);
    setSuggestion('');
  };

  const fetchSuggestion = async () => {
    if (!selectedTask) return;
    setIsLoading(true);
    setSuggestion('');
    const result = await getAIBasedSuggestion(selectedTask);
    setSuggestion(result);
    setIsLoading(false);
  };

  return (
    <Layout>
      <PageTransition>
        <div className="p-4 md:p-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">AI Productivity Coach</h1>
            
            <div className="max-w-2xl mx-auto bg-white dark:bg-bg-dark-secondary p-6 rounded-lg shadow-sm">
            <p className="text-muted-light dark:text-muted-dark mb-4">
                Feeling stuck or tempted? Select one of your "Don't Do" tasks and get a personalized suggestion from your AI coach to help you stay on track.
            </p>

            <div className="space-y-4">
                <div>
                <label htmlFor="task-select" className="block text-sm font-medium text-muted-light dark:text-muted-dark mb-1">
                    Which task are you struggling with?
                </label>
                <select
                    id="task-select"
                    onChange={handleTaskSelect}
                    value={selectedTask?.id || ''}
                    className="w-full p-3 bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
                >
                    <option value="" disabled>Select a task...</option>
                    {tasks.map(task => (
                    <option key={task.id} value={task.id}>{task.name}</option>
                    ))}
                </select>
                </div>
                
                <button
                onClick={fetchSuggestion}
                disabled={!selectedTask || isLoading}
                className="w-full flex items-center justify-center px-4 py-3 rounded-md text-white bg-primary-light dark:bg-primary-dark hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    {isLoading ? 'Thinking...' : 'Get Suggestion'}
                </button>
            </div>
            
            {isLoading && (
                <div className="text-center p-8">
                    <div className="animate-pulse">
                        <SparklesIcon className="w-12 h-12 text-primary-light dark:text-primary-dark mx-auto" />
                        <p className="text-muted-light dark:text-muted-dark mt-2">Generating insights...</p>
                    </div>
                </div>
            )}

            {suggestion && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-primary-light/10 dark:bg-primary-dark/10 border-l-4 border-primary-light dark:border-primary-dark rounded-r-lg"
                >
                <p className="text-gray-700 dark:text-gray-200">{suggestion}</p>
                </motion.div>
            )}

            </div>
        </div>
      </PageTransition>
    </Layout>
  );
};
