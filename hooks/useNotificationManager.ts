import { useEffect } from 'react';
import { Task } from '../types';

const TASKS_STORAGE_KEY = 'dont-do-list-tasks';
const NOTIFICATION_STATE_KEY = 'dont-do-list-notification-state';

interface NotificationState {
  [taskId: string]: {
    lastSent: number;
  };
}

const checkAndSendNotifications = () => {
  if (typeof window.Notification === 'undefined' || Notification.permission !== 'granted') {
    return;
  }

  try {
    const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
    const tasks: Task[] = storedTasks ? JSON.parse(storedTasks) : [];
    if (tasks.length === 0) return;
    
    const storedState = localStorage.getItem(NOTIFICATION_STATE_KEY);
    const notificationState: NotificationState = storedState ? JSON.parse(storedState) : {};

    const now = Date.now();
    let stateChanged = false;

    tasks.forEach(task => {
      if (task.reminderInterval && task.reminderInterval > 0) {
        const lastSent = notificationState[task.id]?.lastSent || new Date(task.createdAt).getTime();
        const intervalMillis = task.reminderInterval * 60 * 1000;
        
        if (now - lastSent >= intervalMillis) {
          // Using a generic icon path; ensure an icon exists at this path in your public folder.
          new Notification("Don't Do Reminder", {
            body: `Remember your goal to avoid: "${task.name}"`,
            icon: '/vite.svg',
            silent: true,
          });
          notificationState[task.id] = { lastSent: now };
          stateChanged = true;
        }
      }
    });

    if (stateChanged) {
      localStorage.setItem(NOTIFICATION_STATE_KEY, JSON.stringify(notificationState));
    }
  } catch (error) {
    console.error("Error checking for notifications:", error);
  }
};

export const useNotificationManager = () => {
  useEffect(() => {
    // Check immediately on load to catch up on any missed notifications
    checkAndSendNotifications(); 
    
    // Then check every minute for new notifications
    const intervalId = setInterval(checkAndSendNotifications, 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);
};
