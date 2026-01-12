import { Checkin, Habit } from '@/types';
import { formatDate } from './storage';

export interface DayStats {
  date: string;
  completed: number;
  total: number;
  onTrack: boolean;
}

export interface StreakStats {
  currentStreak: number;
  bestStreak: number;
  totalOnTrackDays: number;
}

/**
 * Check if a day is "on track" based on the threshold
 * Default: completing >= 4 of 5 active habits
 */
export function isDayOnTrack(
  completedCount: number,
  activeHabitsCount: number,
  threshold: number
): boolean {
  if (activeHabitsCount === 0) return false;
  return completedCount >= threshold;
}

/**
 * Get stats for a specific date
 */
export function getDayStats(
  date: string,
  habits: Habit[],
  checkins: Checkin[],
  threshold: number
): DayStats {
  const activeHabits = habits.filter((h) => h.active);
  const dayCheckins = checkins.filter((c) => c.date === date);
  const completed = dayCheckins.filter((c) => c.completed).length;

  return {
    date,
    completed,
    total: activeHabits.length,
    onTrack: isDayOnTrack(completed, activeHabits.length, threshold),
  };
}

/**
 * Get stats for the last N days
 */
export function getLastNDaysStats(
  days: number,
  habits: Habit[],
  checkins: Checkin[],
  threshold: number
): DayStats[] {
  const stats: DayStats[] = [];
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = formatDate(date);
    stats.push(getDayStats(dateString, habits, checkins, threshold));
  }

  return stats.reverse(); // oldest first
}

/**
 * Calculate current streak and best streak
 * A streak is consecutive "on track" days
 */
export function calculateStreaks(
  habits: Habit[],
  checkins: Checkin[],
  threshold: number
): StreakStats {
  const today = new Date();
  const daysToCheck = 365; // Check last year
  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;
  let totalOnTrackDays = 0;

  // Start from today and go backwards
  for (let i = 0; i < daysToCheck; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = formatDate(date);

    const dayStats = getDayStats(dateString, habits, checkins, threshold);

    if (dayStats.onTrack) {
      tempStreak++;
      totalOnTrackDays++;
      if (i === 0 || currentStreak > 0) {
        currentStreak++;
      }
      if (tempStreak > bestStreak) {
        bestStreak = tempStreak;
      }
    } else {
      if (i === 0) {
        currentStreak = 0;
      }
      tempStreak = 0;
    }
  }

  return {
    currentStreak,
    bestStreak,
    totalOnTrackDays,
  };
}

/**
 * Get completion rate for a habit over the last N days
 */
export function getHabitCompletionRate(
  habitId: string,
  days: number,
  checkins: Checkin[]
): number {
  const today = new Date();
  let completed = 0;

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = formatDate(date);

    const checkin = checkins.find((c) => c.habitId === habitId && c.date === dateString);
    if (checkin && checkin.completed) {
      completed++;
    }
  }

  return days > 0 ? Math.round((completed / days) * 100) : 0;
}
