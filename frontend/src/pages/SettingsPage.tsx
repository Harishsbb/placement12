import React, { useState } from 'react';
import { Settings, Moon, Bell, Shield, Database, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SettingsPage: React.FC = () => {
  const { seedDemoData } = useAuth();
  const [seeding, setSeeding] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSeed = async () => {
    setSeeding(true);
    setMsg('');
    try {
      await seedDemoData();
      setMsg('Demo data re-seeded successfully!');
    } catch (e: any) {
      setMsg('Seeding failed');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-slate-400" />
          <span>Platform Settings</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Configure preferences, theme defaults, and demo data.</p>
      </div>

      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-6">
        {msg && (
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
            {msg}
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">Dark Theme Aesthetic</h3>
              <p className="text-xs text-slate-400">Gaming × Productivity Dark Mode (Default Enabled)</p>
            </div>
            <div className="px-3 py-1 bg-purple-600/20 text-purple-300 border border-purple-500/30 rounded-lg text-xs font-bold">
              Dark Mode Active
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">Evening Schedule Notifications</h3>
              <p className="text-xs text-slate-400">Receive alerts at 6:15 PM for post-college DSA practice</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 accent-purple-600" />
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">Re-Seed Sample Placement Data</h3>
              <p className="text-xs text-slate-400">Populate demo tasks, DSA problems, applications, and goals</p>
            </div>
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/20 flex items-center gap-1.5"
            >
              <Database className="w-3.5 h-3.5" />
              <span>{seeding ? 'Seeding...' : 'Seed Data'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
