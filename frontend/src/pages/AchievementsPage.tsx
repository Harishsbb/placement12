import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Trophy, Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import { Achievement } from '../types';

export const AchievementsPage: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/achievements').then((res) => {
      if (res.data.success) setAchievements(res.data.achievements);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="py-20 text-center text-slate-400">Loading Achievements...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-400" />
          <span>Placement Quest Trophies & Badges</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Unlock badges as you complete daily routines, DSA milestones, and mock sessions.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {achievements.map((ach) => (
          <div
            key={ach._id}
            className={`p-5 rounded-3xl border transition-all text-center space-y-2 relative overflow-hidden ${
              ach.isUnlocked
                ? 'glass-card border-amber-500/40 shadow-xl shadow-amber-500/10'
                : 'bg-slate-950/40 border-slate-900 opacity-50'
            }`}
          >
            {ach.isUnlocked && (
              <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                UNLOCKED
              </div>
            )}
            <div className="text-4xl mx-auto my-2">{ach.icon}</div>
            <h3 className="text-sm font-extrabold text-white">{ach.title}</h3>
            <p className="text-xs text-slate-400">{ach.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
