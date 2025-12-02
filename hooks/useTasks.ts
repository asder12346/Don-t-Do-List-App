import { useState, useEffect, useCallback } from 'react';
import { Task } from '../types';

const TASKS_STORAGE_KEY = 'dont-do-list-tasks';

const getTodayDateString = () => new Date().toISOString().split('T')[0];

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  // A flag to prevent saving to localStorage until the initial load is complete.
  const [isLoading, setIsLoading] = useState(true);

  // Effect for initial loading from localStorage
  useEffect(() => {
    try {
      const storedTasks = window.localStorage.getItem(TASKS_STORAGE_KEY);
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error("Failed to load tasks from localStorage", error);
      alert("Error: Could not load your saved tasks. Your browser's storage may be disabled or full.");
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  // Effect for saving tasks to localStorage
  useEffect(() => {
    // Prevent overwriting storage with the initial empty state before loading is finished.
    if (isLoading) {
      return;
    }
    try {
      window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error("Failed to save tasks to localStorage", error);
      alert("Error: Could not save your latest changes. Your browser's storage may be disabled or full.");
    }
  }, [tasks, isLoading]);

  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt' | 'avoidedOn'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      avoidedOn: [],
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  }, []);

  const updateTask = useCallback((updatedTaskData: Omit<Task, 'createdAt' | 'avoidedOn'> & { id: string }) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === updatedTaskData.id ? { ...task, ...updatedTaskData } : task
      )
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  }, []);

  const toggleAvoided = useCallback((id: string) => {
    const today = getTodayDateString();
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === id) {
          const isAvoided = task.avoidedOn.includes(today);
          const newAvoidedOn = isAvoided
            ? task.avoidedOn.filter(date => date !== today)
            : [...task.avoidedOn, today];
          return { ...task, avoidedOn: newAvoidedOn };
        }
        return task;
      })
    );
  }, []);
  
  const isTaskAvoidedToday = useCallback((task: Task) => {
    const today = getTodayDateString();
    return task.avoidedOn.includes(today);
  }, []);

  const reorderTasks = useCallback((newOrder: Task[]) => {
    setTasks(newOrder);
  }, []);

  return { tasks, addTask, updateTask, deleteTask, toggleAvoided, isTaskAvoidedToday, reorderTasks };
};