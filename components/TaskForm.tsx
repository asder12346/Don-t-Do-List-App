
import React, { useState, useEffect } from 'react';
import { Task, ImpactTier, Category } from '../types';

interface TaskFormProps {
  onSave: (task: Omit<Task, 'id' | 'createdAt' | 'avoidedOn'> & { id?: string }) => void;
  onClose: () => void;
  taskToEdit?: Task | null;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onSave, onClose, taskToEdit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tier, setTier] = useState<ImpactTier>(ImpactTier.MEDIUM);
  const [category, setCategory] = useState<Category>(Category.DISTRACTION);
  const [reminderInterval, setReminderInterval] = useState(0);

  useEffect(() => {
    if (taskToEdit) {
      setName(taskToEdit.name);
      setDescription(taskToEdit.description || '');
      setTier(taskToEdit.tier);
      setCategory(taskToEdit.category);
      setReminderInterval(taskToEdit.reminderInterval || 0);
    } else {
      setName('');
      setDescription('');
      setTier(ImpactTier.MEDIUM);
      setCategory(Category.DISTRACTION);
      setReminderInterval(0);
    }
  }, [taskToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const taskData = {
      name,
      description,
      tier,
      category,
      reminderInterval,
    };
    
    if(taskToEdit) {
        onSave({ ...taskData, id: taskToEdit.id });
    } else {
        onSave(taskData);
    }
  };

  const inputClasses = "w-full p-3 bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-muted-light dark:text-muted-dark mb-1">Task Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., No Instagram before 12PM"
          className={inputClasses}
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-muted-light dark:text-muted-dark mb-1">Description (Optional)</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Why do you want to avoid this?"
          className={inputClasses}
          rows={3}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
            <label htmlFor="tier" className="block text-sm font-medium text-muted-light dark:text-muted-dark mb-1">Impact Tier</label>
            <select id="tier" value={tier} onChange={(e) => setTier(e.target.value as ImpactTier)} className={inputClasses}>
            {Object.values(ImpactTier).map((t) => (
                <option key={t} value={t}>{t}</option>
            ))}
            </select>
        </div>
        <div>
            <label htmlFor="category" className="block text-sm font-medium text-muted-light dark:text-muted-dark mb-1">Category</label>
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value as Category)} className={inputClasses}>
            {Object.values(Category).map((c) => (
                <option key={c} value={c}>{c}</option>
            ))}
            </select>
        </div>
      </div>
       <div>
        <label htmlFor="reminder" className="block text-sm font-medium text-muted-light dark:text-muted-dark mb-2">Reminder Interval</label>
        <div className="flex flex-wrap gap-2 mb-3">
            {[15, 30, 60, 120].map((mins) => (
                <button
                    key={mins}
                    type="button"
                    onClick={() => setReminderInterval(mins)}
                    className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                        reminderInterval === mins
                            ? 'bg-primary-light dark:bg-primary-dark text-white border-transparent'
                            : 'bg-transparent text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-slate-700'
                    }`}
                >
                    {mins < 60 ? `${mins}m` : `${mins / 60}h`}
                </button>
            ))}
             <button
                    type="button"
                    onClick={() => setReminderInterval(0)}
                    className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                        reminderInterval === 0
                            ? 'bg-gray-500 text-white border-transparent'
                            : 'bg-transparent text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-slate-700'
                    }`}
                >
                    None
            </button>
        </div>
        <div className="relative">
            <input
            id="reminder"
            type="number"
            value={reminderInterval}
            onChange={(e) => setReminderInterval(Math.max(0, Number(e.target.value)))}
            placeholder="Custom interval (in minutes)"
            className={inputClasses}
            min="0"
            />
            <span className="absolute right-3 top-3.5 text-sm text-gray-400 pointer-events-none">min</span>
        </div>
        <p className="text-xs text-muted-light dark:text-muted-dark mt-1">Receive a browser notification at this interval to help you stay on track.</p>
      </div>
      <div className="flex justify-end space-x-4">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-slate-600 hover:bg-gray-300 dark:hover:bg-slate-500 transition-colors">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 rounded-md text-white bg-primary-light dark:bg-primary-dark hover:opacity-90 transition-opacity">
          {taskToEdit ? 'Save Changes' : 'Add Task'}
        </button>
      </div>
    </form>
  );
};
