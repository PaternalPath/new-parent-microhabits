'use client';

import { useEffect, useState } from 'react';
import {
  getActiveHabits,
  getCheckinsForDate,
  getTodayString,
  toggleCheckin,
  updateCheckinNote,
} from '@/lib/storage';
import { Habit, Checkin } from '@/types';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { useToast } from '@/components/ui/Toast';

export default function TodayPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [today] = useState(getTodayString());
  const [noteInputs, setNoteInputs] = useState<Record<string, string>>({});
  const { showToast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const activeHabits = getActiveHabits();
    const todayCheckins = getCheckinsForDate(getTodayString());
    setHabits(activeHabits);
    setCheckins(todayCheckins);

    // Initialize note inputs
    const notes: Record<string, string> = {};
    todayCheckins.forEach((c) => {
      if (c.note) notes[c.habitId] = c.note;
    });
    setNoteInputs(notes);
  };

  const handleToggle = (habitId: string, habitName: string) => {
    const checkin = toggleCheckin(habitId, today);
    if (checkin.completed) {
      showToast(`✨ ${habitName} completed!`, 'success');
    }
    loadData();
  };

  const handleNoteChange = (habitId: string, note: string) => {
    setNoteInputs({ ...noteInputs, [habitId]: note });
  };

  const handleNoteSave = (habitId: string) => {
    const note = noteInputs[habitId] || '';
    if (note.trim()) {
      updateCheckinNote(habitId, today, note);
      loadData();
    }
  };

  const isCompleted = (habitId: string) => {
    const checkin = checkins.find((c) => c.habitId === habitId);
    return checkin?.completed || false;
  };

  const completedCount = checkins.filter((c) => c.completed).length;
  const totalCount = habits.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Today"
        description={new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      />

      {habits.length === 0 ? (
        <Card variant="elevated">
          <EmptyState
            icon="✨"
            title="No Active Habits"
            description="Start building your daily routine by adding your first habit. Small steps lead to big changes!"
            action={{
              label: '+ Add Your First Habit',
              onClick: () => (window.location.href = '/habits'),
            }}
          />
        </Card>
      ) : (
        <>
          {/* Progress bar */}
          <Card padding="md">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Daily Progress
              </span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {completedCount}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">/ {totalCount}</span>
              </div>
            </div>
            <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {progressPercent > 0 && (
              <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 text-center">
                {progressPercent === 100
                  ? '🎉 Perfect day! All habits completed!'
                  : `${Math.round(progressPercent)}% complete - keep going!`}
              </p>
            )}
          </Card>

          {/* Habits list */}
          <div className="space-y-3">
            {habits.map((habit) => {
              const completed = isCompleted(habit.id);
              return (
                <Card key={habit.id} variant="bordered" padding="md">
                  <div className="flex items-start gap-4">
                    {/* Checkbox button */}
                    <button
                      onClick={() => handleToggle(habit.id, habit.name)}
                      className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${
                        completed
                          ? 'bg-green-500 border-green-500 dark:bg-green-600 dark:border-green-600 shadow-md'
                          : 'border-gray-300 hover:border-green-400 dark:border-gray-600 dark:hover:border-green-500'
                      }`}
                      aria-label={completed ? `Mark ${habit.name} as incomplete` : `Complete ${habit.name}`}
                    >
                      {completed && (
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>

                    {/* Habit info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {habit.icon && <span className="text-2xl">{habit.icon}</span>}
                        <h3
                          className={`font-semibold text-lg ${
                            completed
                              ? 'text-gray-500 dark:text-gray-500 line-through'
                              : 'text-gray-900 dark:text-gray-100'
                          }`}
                        >
                          {habit.name}
                        </h3>
                      </div>
                      {habit.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {habit.description}
                        </p>
                      )}

                      {/* Note input */}
                      <input
                        type="text"
                        placeholder="Add a note (optional)"
                        value={noteInputs[habit.id] || ''}
                        onChange={(e) => handleNoteChange(habit.id, e.target.value)}
                        onBlur={() => handleNoteSave(habit.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleNoteSave(habit.id);
                            e.currentTarget.blur();
                          }
                        }}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500"
                      />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Encouragement message */}
          {completedCount === totalCount && totalCount > 0 && (
            <Card padding="md" className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 dark:from-green-900/20 dark:to-emerald-900/20 dark:border-green-800">
              <div className="text-center">
                <div className="text-4xl mb-2">🎉</div>
                <p className="text-lg font-semibold text-green-800 dark:text-green-300 mb-1">
                  Amazing work!
                </p>
                <p className="text-sm text-green-700 dark:text-green-400">
                  You completed all your habits today. You&apos;re building an incredible routine!
                </p>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
