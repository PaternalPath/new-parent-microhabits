'use client';

import { useEffect, useState } from 'react';
import { getHabits, addHabit, updateHabit, deleteHabit } from '@/lib/storage';
import { Habit } from '@/types';

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
  });

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = () => {
    const allHabits = getHabits();
    setHabits(allHabits);
  };

  const handleAdd = () => {
    if (!formData.name.trim()) return;

    addHabit({
      name: formData.name,
      description: formData.description || undefined,
      icon: formData.icon || undefined,
      active: true,
    });

    setFormData({ name: '', description: '', icon: '' });
    setIsAdding(false);
    loadHabits();
  };

  const handleEdit = (habit: Habit) => {
    setEditingId(habit.id);
    setFormData({
      name: habit.name,
      description: habit.description || '',
      icon: habit.icon || '',
    });
  };

  const handleUpdate = () => {
    if (!editingId || !formData.name.trim()) return;

    updateHabit(editingId, {
      name: formData.name,
      description: formData.description || undefined,
      icon: formData.icon || undefined,
    });

    setEditingId(null);
    setFormData({ name: '', description: '', icon: '' });
    loadHabits();
  };

  const handleToggleActive = (habit: Habit) => {
    updateHabit(habit.id, { active: !habit.active });
    loadHabits();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this habit? This will also delete all check-ins.')) {
      deleteHabit(id);
      loadHabits();
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: '', description: '', icon: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Habits</h1>
        {!isAdding && !editingId && (
          <button
            onClick={() => setIsAdding(true)}
            className="btn btn-primary"
          >
            + Add Habit
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">
            {isAdding ? 'Add New Habit' : 'Edit Habit'}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Icon (emoji)
              </label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="🎯"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Morning walk"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Add a short description (optional)"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={isAdding ? handleAdd : handleUpdate}
                className="btn btn-primary"
                disabled={!formData.name.trim()}
              >
                {isAdding ? 'Add' : 'Save'}
              </button>
              <button onClick={handleCancel} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Habits List */}
      <div className="space-y-3">
        {habits.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-gray-500">No habits yet. Add your first habit to get started!</p>
          </div>
        ) : (
          habits.map((habit) => (
            <div
              key={habit.id}
              className={`card p-4 ${!habit.active ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  {habit.icon && <span className="text-2xl">{habit.icon}</span>}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{habit.name}</h3>
                    {habit.description && (
                      <p className="text-sm text-gray-600 mt-1">{habit.description}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      {habit.active ? '✓ Active' : '○ Inactive'}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleActive(habit)}
                    className="text-sm px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200"
                    title={habit.active ? 'Deactivate' : 'Activate'}
                  >
                    {habit.active ? '⏸' : '▶️'}
                  </button>
                  <button
                    onClick={() => handleEdit(habit)}
                    className="text-sm px-3 py-1 rounded-lg bg-blue-100 hover:bg-blue-200"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(habit.id)}
                    className="text-sm px-3 py-1 rounded-lg bg-red-100 hover:bg-red-200"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {habits.length > 0 && (
        <div className="card p-4 bg-blue-50 border-blue-200">
          <p className="text-sm text-blue-800">
            💡 Tip: Use the toggle button to temporarily pause a habit without deleting it.
          </p>
        </div>
      )}
    </div>
  );
}
