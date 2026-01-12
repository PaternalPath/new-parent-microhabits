'use client';

import { useEffect, useState } from 'react';
import { getHabits, getCheckins, getSettings } from '@/lib/storage';
import { getLastNDaysStats, calculateStreaks } from '@/lib/streaks';
import { Habit, Checkin, Settings } from '@/types';

export default function RecapPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setHabits(getHabits());
    setCheckins(getCheckins());
    setSettings(getSettings());
  };

  if (!settings) return null;

  const last7Days = getLastNDaysStats(7, habits, checkins, settings.onTrackThreshold);
  const streakStats = calculateStreaks(habits, checkins, settings.onTrackThreshold);

  const totalDays = last7Days.length;
  const onTrackDays = last7Days.filter((d) => d.onTrack).length;
  const totalCompleted = last7Days.reduce((sum, day) => sum + day.completed, 0);
  const totalPossible = last7Days.reduce((sum, day) => sum + day.total, 0);
  const overallRate = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;

  const generateRecapText = () => {
    const startDate = last7Days[0]?.date || '';
    const endDate = last7Days[last7Days.length - 1]?.date || '';

    return `📊 My New Parent Micro-Habits Recap

📅 Week: ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}

✅ Completion Rate: ${overallRate}%
🔥 Current Streak: ${streakStats.currentStreak} days
⭐ Best Streak: ${streakStats.bestStreak} days
📈 On-Track Days: ${onTrackDays}/${totalDays}

Daily Breakdown:
${last7Days
  .map((day) => {
    const date = new Date(day.date);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const status = day.onTrack ? '✓' : '○';
    return `${status} ${dayName}: ${day.completed}/${day.total}`;
  })
  .join('\n')}

Keep building those healthy habits! 💪

#NewParent #MicroHabits #SelfCare`;
  };

  const handleCopy = async () => {
    const text = generateRecapText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Weekly Recap</h1>
        <p className="text-gray-600 mt-1">Your last 7 days at a glance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{overallRate}%</div>
          <div className="text-xs text-gray-600 mt-1">Completion Rate</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{onTrackDays}/{totalDays}</div>
          <div className="text-xs text-gray-600 mt-1">On-Track Days</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{streakStats.currentStreak}</div>
          <div className="text-xs text-gray-600 mt-1">Current Streak</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{totalCompleted}</div>
          <div className="text-xs text-gray-600 mt-1">Total Completed</div>
        </div>
      </div>

      {/* Visual Calendar */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4">Weekly Calendar</h2>
        <div className="grid grid-cols-7 gap-2">
          {last7Days.map((day) => {
            const date = new Date(day.date);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const dayNum = date.getDate();
            const completionRate = day.total > 0 ? (day.completed / day.total) * 100 : 0;

            return (
              <div key={day.date} className="text-center">
                <div className="text-xs text-gray-600 mb-1">{dayName}</div>
                <div
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center ${
                    day.onTrack
                      ? 'bg-green-100 border-2 border-green-500'
                      : completionRate > 0
                      ? 'bg-yellow-100 border-2 border-yellow-400'
                      : 'bg-gray-100 border-2 border-gray-300'
                  }`}
                >
                  <div className="text-lg font-bold">{dayNum}</div>
                  <div className="text-xs mt-1">
                    {day.completed}/{day.total}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Shareable Recap Card */}
      <div className="card p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <h2 className="text-lg font-semibold mb-4">📊 Shareable Recap</h2>
        <pre className="whitespace-pre-wrap text-sm text-gray-800 mb-4 font-sans">
          {generateRecapText()}
        </pre>
        <button onClick={handleCopy} className="btn btn-primary w-full">
          {copied ? '✓ Copied!' : '📋 Copy Recap Text'}
        </button>
      </div>

      {/* Insights */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4">💡 Insights</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          {overallRate >= 80 && (
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Excellent consistency! You&apos;re maintaining a strong routine.</span>
            </li>
          )}
          {overallRate < 50 && (
            <li className="flex items-start gap-2">
              <span className="text-yellow-500">○</span>
              <span>There&apos;s room for improvement. Try starting with just 1-2 habits.</span>
            </li>
          )}
          {onTrackDays >= 5 && (
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>You hit your target on {onTrackDays} out of {totalDays} days. Great work!</span>
            </li>
          )}
          {streakStats.currentStreak === 0 && last7Days.some((d) => d.completed > 0) && (
            <li className="flex items-start gap-2">
              <span className="text-blue-500">→</span>
              <span>You&apos;re making progress! Keep going to build a streak.</span>
            </li>
          )}
          {streakStats.currentStreak > 0 && (
            <li className="flex items-start gap-2">
              <span className="text-orange-500">🔥</span>
              <span>
                {streakStats.currentStreak === streakStats.bestStreak
                  ? "You're on your best streak ever! Don't break it now!"
                  : `You're ${streakStats.bestStreak - streakStats.currentStreak} days away from your best streak!`}
              </span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
