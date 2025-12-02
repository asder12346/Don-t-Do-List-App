

import React, { useState } from 'react';
import { AnimatePresence, motion, Reorder, useDragControls } from 'framer-motion';
import { Layout } from '../components/Layout';
import { TaskCard } from '../components/TaskCard';
import { Modal } from '../components/Modal';
import { TaskForm } from '../components/TaskForm';
import { PlusIcon } from '../components/icons';
import { useTasks } from '../hooks/useTasks';
import { Task } from '../types';
import { PageTransition } from '../components/PageTransition';
import { triggerHaptic } from '../utils/haptics';

const EmptyStateAnimation = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative w-48 h-48 mb-6"
      >
        {/* Background glow */}
        <div className="absolute inset-0 bg-primary-light/20 dark:bg-primary-dark/20 rounded-full blur-3xl animate-pulse" />
        
        {/* Rotating Rings */}
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-2 border-dashed border-primary-light/30 dark:border-primary-dark/30 rounded-full"
        />
        <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 border border-primary-light/20 dark:border-primary-dark/20 rounded-full"
        />
        
        {/* Central Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-primary-light dark:text-primary-dark opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            </motion.div>
        </div>
      </motion.div>

      <motion.h2 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-bold text-gray-800 dark:text-white mb-1"
      >
        Welcome to Don't Do List
      </motion.h2>
       <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg font-medium text-primary-light dark:text-primary-dark mb-4"
      >
          Your Mind is Clear
      </motion.p>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-muted-light dark:text-muted-dark max-w-xs mx-auto"
      >
        Start your journey by adding the first thing you want to <b>avoid</b> doing today.
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, type: "spring" }}
        className="mt-6"
      >
          <p className="text-sm font-medium text-primary-light dark:text-primary-dark animate-pulse">Tap the + button to begin</p>
      </motion.div>
    </div>
);

const WelcomeBanner: React.FC<{ tasksCount: number }> = ({ tasksCount }) => {
    if (tasksCount > 0) {
        const today = new Date();
        const streak = 3; // Mock data
        return (
             <div className="bg-white dark:bg-bg-dark-secondary p-6 rounded-lg shadow-sm mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Hello there!</h2>
                <p className="text-muted-light dark:text-muted-dark mt-1">Today is {today.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}.</p>
                <p className="text-muted-light dark:text-muted-dark mt-1">You're on a {streak}-day streak. Keep it up! 🔥</p>
            </div>
        )
    }
    
    return <EmptyStateAnimation />;
};

interface DraggableTaskItemProps {
    task: Task;
    deleteTask: (id: string) => void;
    handleEditTask: (task: Task) => void;
    toggleAvoided: (id: string) => void;
    isTaskAvoidedToday: (task: Task) => boolean;
}

// Wrapper component to provide drag controls for each individual item
const DraggableTaskItem: React.FC<DraggableTaskItemProps> = ({ 
    task, 
    deleteTask, 
    handleEditTask, 
    toggleAvoided, 
    isTaskAvoidedToday 
}) => {
    const dragControls = useDragControls();

    return (
        <Reorder.Item
            value={task}
            id={task.id}
            dragListener={false} // Disable default drag to use specific handle
            dragControls={dragControls}
            whileDrag={{ 
                scale: 1.02, 
                boxShadow: "0px 10px 20px rgba(0,0,0,0.1)",
                zIndex: 50
            }}
            className="mb-0" // Remove default margin as TaskCard has margin
        >
            <TaskCard
                task={task}
                onDelete={deleteTask}
                onEdit={handleEditTask}
                onToggleAvoided={toggleAvoided}
                isAvoidedToday={isTaskAvoidedToday(task)}
                dragControls={dragControls}
            />
        </Reorder.Item>
    );
};

export const HomePage: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask, toggleAvoided, isTaskAvoidedToday, reorderTasks } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const handleOpenModal = () => {
      triggerHaptic(15);
      setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTaskToEdit(null);
  };

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'avoidedOn'> & { id?: string }) => {
    if (taskData.id) {
      updateTask(taskData as Task);
    } else {
      addTask(taskData);
    }
    handleCloseModal();
  };
  
  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  return (
    <Layout>
      <PageTransition>
        <div className="p-4 md:p-8">
            {tasks.length > 0 && <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Today's Don't List</h1>}
            <WelcomeBanner tasksCount={tasks.length} />

            <div className="pb-20">
              <Reorder.Group 
                axis="y" 
                values={tasks} 
                onReorder={reorderTasks}
                className="space-y-4" // Use flex gap or space-y to separate items
              >
                  <AnimatePresence>
                      {tasks.map(task => (
                        <DraggableTaskItem 
                            key={task.id}
                            task={task}
                            deleteTask={deleteTask}
                            handleEditTask={handleEditTask}
                            toggleAvoided={toggleAvoided}
                            isTaskAvoidedToday={isTaskAvoidedToday}
                        />
                      ))}
                  </AnimatePresence>
              </Reorder.Group>
            </div>

            <button
            onClick={handleOpenModal}
            className="fixed bottom-20 right-5 md:bottom-8 md:right-8 bg-primary-light dark:bg-primary-dark text-white rounded-full p-4 shadow-lg hover:scale-105 transition-transform z-30"
            aria-label="Add new task"
            >
            <PlusIcon className="w-8 h-8" />
            </button>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={taskToEdit ? "Edit Task" : "Add New Task"}>
            <TaskForm onSave={handleSaveTask} onClose={handleCloseModal} taskToEdit={taskToEdit} />
            </Modal>
        </div>
      </PageTransition>
    </Layout>
  );
};
