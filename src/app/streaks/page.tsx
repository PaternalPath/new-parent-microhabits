'use client';

import { useEffect, useState } from 'react';
import { getHabits, getCheckins, getSettings } from '@/lib/storage';
import { calculateStreaks, getLastNDaysStats, getHabitCompletionRate } from '@/lib/streaks';
import { Habit, Checkin, Settings } from '@/types';

export default function StreaksPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setHabits(getHabits());
    setCheckins(getCheckins());
    setSettings(getSettings());
  };

  if (!settings) return null;

  const streakStats = calculateStreaks(habits, checkins, settings.onTrackThreshold);
  const last7Days = getLastNDaysStats(7, habits, checkins, settings.onTrackThreshold);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Streaks</h1>
        <p className="text-gray-600 mt-1">Track your consistency over time</p>
      </div>

      {/* Streak Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-6 text-center">
          <div className="text-5xl mb-2">🔥</div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {streakStats.currentStreak}
          </div>
          <div className="text-sm text-gray-600">Current Streak</div>
          <div className="text-xs text-gray-500 mt-1">consecutive on-track days</div>
        </div>

        <div className="card p-6 text-center">
          <div className="text-5xl mb-2">⭐</div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {streakStats.bestStreak}
          </div>
          <div className="text-sm text-gray-600">Best Streak</div>
          <div className="text-xs text-gray-500 mt-1">personal record</div>
        </div>

        <div className="card p-6 text-center">
          <div className="text-5xl mb-2">📅</div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {streakStats.totalOnTrackDays}
          </div>
          <div className="text-sm text-gray-600">Total On-Track</div>
          <div className="text-xs text-gray-500 mt-1">all-time days</div>
        </div>
      </div>

      {/* On-Track Definition */}
      <div className="card p-4 bg-blue-50 border-blue-200">
        <p className="text-sm text-blue-800">
          💡 An &quot;on-track day&quot; means completing at least {settings.onTrackThreshold} of your active habits.
          Change this in Settings.
        </p>
      </div>

      {/* Last 7 Days */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4">Last 7 Days</h2>
        <div className="space-y-2">
          {last7Days.map((day) => {
            const date = new Date(day.date);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const dayNum = date.getDate();

            return (
              <div key={day.date} className="flex items-center gap-3">
                <div className="w-12 text-sm text-gray-600">
                  {dayName} {dayNum}
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden">
                    <div
                      className={`h-full ${
                        day.onTrack ? 'bg-green-500' : 'bg-gray-300'
                      } transition-all`}
                      style={{
                        width: `${day.total > 0 ? (day.completed / day.total) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <div className="w-16 text-right text-sm font-medium">
                    {day.completed}/{day.total}
                  </div>
                  <div className="w-6">
                    {day.onTrack && <span className="text-green-500">✓</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Individual Habit Rates */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4">30-Day Completion Rates</h2>
        <div className="space-y-3">
          {habits.filter((h) => h.active).map((habit) => {
            const rate = getHabitCompletionRate(habit.id, 30, checkins);
            return (
              <div key={habit.id}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    {habit.icon && <span>{habit.icon}</span>}
                    <span className="text-sm font-medium">{habit.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{rate}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      rate >= 80
                        ? 'bg-green-500'
                        : rate >= 50
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${rate}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Encouragement */}
      {streakStats.currentStreak > 0 && (
        <div className="card p-6 bg-green-50 border-green-200 text-center">
          <p className="text-green-800 font-medium">
            {streakStats.currentStreak === 1
              ? '🎉 Great start! Keep it up!'
              : streakStats.currentStreak < 7
              ? `🔥 ${streakStats.currentStreak} days strong! You&apos;re building momentum!`
              : streakStats.currentStreak < 30
              ? `⭐ Amazing ${streakStats.currentStreak}-day streak! You&apos;re crushing it!`
              : `🏆 Incredible! ${streakStats.currentStreak} days of consistency! You&apos;re an inspiration!`}
          </p>
        </div>
      )}
    </div>
  );
}
