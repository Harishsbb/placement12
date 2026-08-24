import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Clock, Plus, Check, Save, Sparkles, BookOpen } from 'lucide-react';
import { DailyPlan, ScheduleSlot } from '../types';

export const TodayPlanPage: React.FC = () => {
  const [plan, setPlan] = useState<DailyPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/daily-plan').then(res => {
      if (res.data.success) {
        setPlan(res.data.plan);
      }
    }).finally(() => setLoading(false));
  }, []);

  const handleToggleSlot = (index: number) => {
    if (!plan) return;
    const newSlots = [...plan.slots];
    newSlots[index].isCompleted = !newSlots[index].isCompleted;
    setPlan({ ...plan, slots: newSlots });
  };

  const handleSavePlan = async () => {
    if (!plan) return;
    setSaving(true);
    try {
      await api.put('/daily-plan', { date: plan.date, slots: plan.slots });
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-slate-400">Loading Today's Evening Plan...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            <Clock className="w-6 h-6 text-purple-400" />
            <span>Today's Evening Preparation Plan</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Optimized for college hours (8:00 AM – 5:30 PM). Balance learning with relaxation.
          </p>
        </div>

        <button
          onClick={handleSavePlan}
          disabled={saving}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/25 flex items-center gap-2 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Schedule'}</span>
        </button>
      </div>

      {/* Routine Slots List */}
      <div className="space-y-3">
        {plan?.slots?.map((slot, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
              slot.isCompleted
                ? 'bg-slate-950/60 border-slate-900 opacity-80'
                : 'bg-slate-900/80 border-slate-800 hover:border-purple-500/40'
            }`}
          >
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleToggleSlot(idx)}
                className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors ${
                  slot.isCompleted
                    ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                    : 'border-slate-700 hover:border-purple-400 text-transparent'
                }`}
              >
                <Check className="w-4 h-4 stroke-[3]" />
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-[11px] font-bold text-purple-300 border border-slate-700">
                    {slot.timeRange}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-purple-500/10 text-[10px] font-semibold text-purple-300 border border-purple-500/20">
                    {slot.category}
                  </span>
                </div>
                <h3 className={`text-sm font-semibold mt-1 ${slot.isCompleted ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                  {slot.activity}
                </h3>
              </div>
            </div>

            <div className="text-right text-xs text-slate-500 hidden sm:block">
              {slot.isCompleted ? 'Completed ✅' : 'Scheduled'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
