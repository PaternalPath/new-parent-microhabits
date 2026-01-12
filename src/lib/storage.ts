import {
  AppData,
  Habit,
  Checkin,
  Settings,
  DEFAULT_SETTINGS,
  STORAGE_VERSION,
  STORAGE_KEY,
} from '@/types';

// Default habits for new parents
export const DEFAULT_HABITS: Habit[] = [
  {
    id: 'habit-1',
    name: '5-min self-care',
    description: 'Take 5 minutes for yourself today',
    icon: '🧘',
    active: true,
    createdAt: new Date().toISOString(),
    order: 0,
  },
  {
    id: 'habit-2',
    name: 'Drink water',
    description: 'Stay hydrated throughout the day',
    icon: '💧',
    active: true,
    createdAt: new Date().toISOString(),
    order: 1,
  },
  {
    id: 'habit-3',
    name: 'Connect with partner',
    description: 'Check in with your partner',
    icon: '💬',
    active: true,
    createdAt: new Date().toISOString(),
    order: 2,
  },
  {
    id: 'habit-4',
    name: 'Sleep when baby sleeps',
    description: 'Rest during nap time',
    icon: '😴',
    active: true,
    createdAt: new Date().toISOString(),
    order: 3,
  },
  {
    id: 'habit-5',
    name: 'Ask for help',
    description: 'Reach out when you need support',
    icon: '🤝',
    active: true,
    createdAt: new Date().toISOString(),
    order: 4,
  },
];

function getEmptyAppData(): AppData {
  return {
    version: STORAGE_VERSION,
    habits: DEFAULT_HABITS,
    checkins: [],
    settings: DEFAULT_SETTINGS,
    lastModified: new Date().toISOString(),
  };
}

export function loadData(): AppData {
  if (typeof window === 'undefined') {
    return getEmptyAppData();
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      const initialData = getEmptyAppData();
      saveData(initialData);
      return initialData;
    }

    const data: AppData = JSON.parse(stored);

    // Version migration logic (if needed in future)
    if (data.version < STORAGE_VERSION) {
      // Migrate data here
      data.version = STORAGE_VERSION;
      saveData(data);
    }

    return data;
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
    return getEmptyAppData();
  }
}

export function saveData(data: AppData): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    data.lastModified = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
  }
}

export function exportData(): string {
  const data = loadData();
  return JSON.stringify(data, null, 2);
}

export function importData(jsonString: string): boolean {
  try {
    const data: AppData = JSON.parse(jsonString);

    // Validate structure
    if (!data.habits || !data.checkins || !data.settings) {
      throw new Error('Invalid data structure');
    }

    saveData(data);
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
}

export function resetData(): void {
  const freshData = getEmptyAppData();
  saveData(freshData);
}

// Habit operations
export function getHabits(): Habit[] {
  const data = loadData();
  return data.habits.sort((a, b) => a.order - b.order);
}

export function getActiveHabits(): Habit[] {
  return getHabits().filter((h) => h.active);
}

export function addHabit(habit: Omit<Habit, 'id' | 'createdAt' | 'order'>): Habit {
  const data = loadData();
  const newHabit: Habit = {
    ...habit,
    id: `habit-${Date.now()}`,
    createdAt: new Date().toISOString(),
    order: data.habits.length,
  };
  data.habits.push(newHabit);
  saveData(data);
  return newHabit;
}

export function updateHabit(id: string, updates: Partial<Habit>): void {
  const data = loadData();
  const index = data.habits.findIndex((h) => h.id === id);
  if (index !== -1) {
    data.habits[index] = { ...data.habits[index], ...updates };
    saveData(data);
  }
}

export function deleteHabit(id: string): void {
  const data = loadData();
  data.habits = data.habits.filter((h) => h.id !== id);
  saveData(data);
}

// Checkin operations
export function getCheckins(): Checkin[] {
  const data = loadData();
  return data.checkins;
}

export function getCheckinsForDate(date: string): Checkin[] {
  const data = loadData();
  return data.checkins.filter((c) => c.date === date);
}

export function getCheckinForHabitAndDate(habitId: string, date: string): Checkin | undefined {
  const data = loadData();
  return data.checkins.find((c) => c.habitId === habitId && c.date === date);
}

export function toggleCheckin(habitId: string, date: string, note?: string): Checkin {
  const data = loadData();
  const existing = data.checkins.find((c) => c.habitId === habitId && c.date === date);

  if (existing) {
    // Toggle completion
    existing.completed = !existing.completed;
    existing.completedAt = existing.completed ? new Date().toISOString() : undefined;
    if (note !== undefined) {
      existing.note = note;
    }
    saveData(data);
    return existing;
  } else {
    // Create new checkin
    const newCheckin: Checkin = {
      id: `checkin-${Date.now()}`,
      habitId,
      date,
      completed: true,
      completedAt: new Date().toISOString(),
      note,
    };
    data.checkins.push(newCheckin);
    saveData(data);
    return newCheckin;
  }
}

export function updateCheckinNote(habitId: string, date: string, note: string): void {
  const data = loadData();
  const checkin = data.checkins.find((c) => c.habitId === habitId && c.date === date);
  if (checkin) {
    checkin.note = note;
    saveData(data);
  }
}

// Settings operations
export function getSettings(): Settings {
  const data = loadData();
  return data.settings;
}

export function updateSettings(updates: Partial<Settings>): void {
  const data = loadData();
  data.settings = { ...data.settings, ...updates };
  saveData(data);
}

// Utility: format date as YYYY-MM-DD
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTodayString(): string {
  return formatDate(new Date());
}
