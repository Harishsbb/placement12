import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Target, Plus, CheckCircle2, X } from 'lucide-react';
import { Goal } from '../types';

export const GoalsPage: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [newGoal, setNewGoal] = useState({
    title: 'Solve 50 DSA Medium Problems',
    target: 50,
    currentProgress: 24,
    unit: 'problems',
    category: 'DSA',
    deadline: '2026-09-30'
  });

  const fetchGoals = async () => {
    try {
      const res = await api.get('/goals');
      if (res.data.success) setGoals(res.data.goals);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/goals', newGoal);
      setShowModal(false);
      await fetchGoals();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="py-20 text-center text-slate-400">Loading Placement Goals...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            <Target className="w-6 h-6 text-purple-400" />
            <span>Placement Goals & Targets</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Set target metrics for DSA problems, applications, and mock interviews.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/25 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Goal</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((g) => {
          const pct = Math.min(100, Math.round((g.currentProgress / g.target) * 100));
          return (
            <div key={g._id} className="p-5 rounded-3xl glass-card border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  {g.category}
                </span>
                <span className="text-xs font-bold text-emerald-400">{pct}%</span>
              </div>

              <h3 className="text-sm font-bold text-white">{g.title}</h3>
              <p className="text-xs text-slate-400">
                {g.currentProgress} / {g.target} {g.unit} completed
              </p>

              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Create Goal</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Goal Title</label>
                <input
                  type="text"
                  required
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Target Number</label>
                  <input
                    type="number"
                    required
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({ ...newGoal, target: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Unit</label>
                  <input
                    type="text"
                    required
                    value={newGoal.unit}
                    onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100"
                    placeholder="problems / hours / apps"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/25 mt-2"
              >
                Create Placement Goal
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
