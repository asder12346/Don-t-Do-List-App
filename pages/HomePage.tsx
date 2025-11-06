
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Layout } from '../components/Layout';
import { TaskCard } from '../components/TaskCard';
import { Modal } from '../components/Modal';
import { TaskForm } from '../components/TaskForm';
import { PlusIcon } from '../components/icons';
import { useTasks } from '../hooks/useTasks';
import { Task } from '../types';

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
    return (
        <div className="text-center p-8 bg-white dark:bg-bg-dark-secondary rounded-lg shadow-sm mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Welcome to Don't Do List!</h2>
            <p className="text-muted-light dark:text-muted-dark mt-2">Ready to build better habits? Add your first "Don't Do" task to get started.</p>
        </div>
    );
};

export const HomePage: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask, toggleAvoided, isTaskAvoidedToday } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const handleOpenModal = () => setIsModalOpen(true);
  
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
      <div className="p-4 md:p-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Today's Don't List</h1>
        <WelcomeBanner tasksCount={tasks.length} />

        <div className="space-y-4">
          <AnimatePresence>
            {tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={deleteTask}
                onEdit={handleEditTask}
                onToggleAvoided={toggleAvoided}
                isAvoidedToday={isTaskAvoidedToday(task)}
              />
            ))}
          </AnimatePresence>
        </div>

        <button
          onClick={handleOpenModal}
          className="fixed bottom-20 right-5 md:bottom-8 md:right-8 bg-primary-light dark:bg-primary-dark text-white rounded-full p-4 shadow-lg hover:scale-105 transition-transform"
          aria-label="Add new task"
        >
          <PlusIcon className="w-8 h-8" />
        </button>

        <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={taskToEdit ? "Edit Task" : "Add New Task"}>
          <TaskForm onSave={handleSaveTask} onClose={handleCloseModal} taskToEdit={taskToEdit} />
        </Modal>
      </div>
    </Layout>
  );
};
