export enum ImpactTier {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
}

export enum Category {
  DISTRACTION = 'Distraction',
  OVERCOMMITMENT = 'Overcommitment',
  PROCRASTINATION = 'Procrastination',
}

export interface Task {
  id: string;
  name: string;
  description?: string;
  tier: ImpactTier;
  category: Category;
  createdAt: string; // ISO string
  avoidedOn: string[]; // Array of ISO date strings
  reminderInterval?: number; // in minutes
}

export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}
