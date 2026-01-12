export interface Habit {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  active: boolean;
  createdAt: string;
  order: number;
}

export interface Checkin {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD format
  completed: boolean;
  note?: string;
  completedAt?: string; // ISO timestamp
}

export interface Settings {
  version: number;
  notificationsEnabled: boolean;
  theme: 'light' | 'dark' | 'system';
  onTrackThreshold: number; // number of habits to complete for "on track" day (default 4)
}

export interface AppData {
  version: number;
  habits: Habit[];
  checkins: Checkin[];
  settings: Settings;
  lastModified: string; // ISO timestamp
}

export const DEFAULT_SETTINGS: Settings = {
  version: 1,
  notificationsEnabled: false,
  theme: 'system',
  onTrackThreshold: 4,
};

export const STORAGE_VERSION = 1;
export const STORAGE_KEY = 'new-parent-microhabits';
