'use client';

import { useEffect, useState, useRef } from 'react';
import {
  getSettings,
  updateSettings,
  exportData,
  importData,
  resetData,
} from '@/lib/storage';
import { Settings } from '@/types';

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [importStatus, setImportStatus] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    setSettings(getSettings());
  };

  const handleThresholdChange = (value: number) => {
    updateSettings({ onTrackThreshold: value });
    loadSettings();
  };

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `micro-habits-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const success = importData(content);
      if (success) {
        setImportStatus('✓ Data imported successfully!');
        loadSettings();
        window.location.reload(); // Reload to refresh all data
      } else {
        setImportStatus('✗ Failed to import data. Please check the file format.');
      }
      setTimeout(() => setImportStatus(''), 3000);
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (
      confirm(
        'Are you sure you want to reset all data? This will delete all habits and check-ins. This action cannot be undone.'
      )
    ) {
      if (
        confirm(
          'Last chance! All your data will be permanently deleted. Are you absolutely sure?'
        )
      ) {
        resetData();
        window.location.reload();
      }
    }
  };

  if (!settings) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your preferences and data</p>
      </div>

      {/* On-Track Threshold */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4">On-Track Threshold</h2>
        <p className="text-sm text-gray-600 mb-4">
          Number of habits you need to complete to count a day as &quot;on track&quot;
        </p>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="1"
            max="10"
            value={settings.onTrackThreshold}
            onChange={(e) => handleThresholdChange(parseInt(e.target.value))}
            className="flex-1"
          />
          <div className="w-12 text-center">
            <span className="text-2xl font-bold text-gray-900">
              {settings.onTrackThreshold}
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Current: Complete at least {settings.onTrackThreshold} habits per day
        </p>
      </div>

      {/* Data Management */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4">Data Management</h2>
        <div className="space-y-4">
          {/* Export */}
          <div>
            <button onClick={handleExport} className="btn btn-primary w-full">
              📥 Export Data (JSON)
            </button>
            <p className="text-xs text-gray-600 mt-2">
              Download all your habits and check-ins as a JSON file
            </p>
          </div>

          {/* Import */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              onChange={handleImport}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn btn-secondary w-full"
            >
              📤 Import Data (JSON)
            </button>
            <p className="text-xs text-gray-600 mt-2">
              Restore data from a previously exported JSON file
            </p>
            {importStatus && (
              <p
                className={`text-sm mt-2 ${
                  importStatus.startsWith('✓') ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {importStatus}
              </p>
            )}
          </div>

          {/* Reset */}
          <div className="pt-4 border-t border-gray-200">
            <button onClick={handleReset} className="btn btn-danger w-full">
              🗑️ Reset All Data
            </button>
            <p className="text-xs text-gray-600 mt-2">
              Delete all habits and check-ins. This action cannot be undone.
            </p>
          </div>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="card p-6 bg-green-50 border-green-200">
        <h2 className="text-lg font-semibold mb-2">🔒 Privacy First</h2>
        <p className="text-sm text-gray-700">
          All your data is stored locally in your browser. Nothing is sent to any server.
          Your habits and progress are completely private and under your control.
        </p>
      </div>

      {/* App Info */}
      <div className="card p-6 bg-gray-50">
        <h2 className="text-lg font-semibold mb-2">About</h2>
        <div className="text-sm text-gray-700 space-y-1">
          <p>
            <strong>Version:</strong> {settings.version}
          </p>
          <p>
            <strong>Storage:</strong> Local Browser Storage
          </p>
          <p>
            <strong>Data Location:</strong> This device only
          </p>
        </div>
      </div>
    </div>
  );
}
