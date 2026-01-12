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

export default function TodayPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [today] = useState(getTodayString());
  const [noteInputs, setNoteInputs] = useState<Record<string, string>>({});

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

  const handleToggle = (habitId: string) => {
    toggleCheckin(habitId, today);
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Today</h1>
        <p className="text-gray-600 mt-1">{new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}</p>
      </div>

      {/* Progress bar */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Daily Progress</span>
          <span className="text-sm font-semibold text-gray-900">
            {completedCount} / {totalCount}
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Habits list */}
      <div className="space-y-3">
        {habits.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-gray-500">No active habits. Add some in the Habits tab!</p>
          </div>
        ) : (
          habits.map((habit) => {
            const completed = isCompleted(habit.id);
            return (
              <div key={habit.id} className="card p-4">
                <div className="flex items-start gap-4">
                  {/* Checkbox button */}
                  <button
                    onClick={() => handleToggle(habit.id)}
                    className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                      completed
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300 hover:border-green-400'
                    }`}
                  >
                    {completed && (
                      <svg
                        className="w-5 h-5 text-white"
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
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {habit.icon && <span className="text-xl">{habit.icon}</span>}
                      <h3
                        className={`font-semibold ${
                          completed ? 'text-gray-500 line-through' : 'text-gray-900'
                        }`}
                      >
                        {habit.name}
                      </h3>
                    </div>
                    {habit.description && (
                      <p className="text-sm text-gray-600 mb-2">{habit.description}</p>
                    )}

                    {/* Note input */}
                    <div className="mt-2">
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
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Encouragement message */}
      {completedCount === totalCount && totalCount > 0 && (
        <div className="card p-6 bg-green-50 border-green-200">
          <p className="text-center text-green-800 font-medium">
            🎉 Amazing! You completed all your habits today!
          </p>
        </div>
      )}
    </div>
  );
}
