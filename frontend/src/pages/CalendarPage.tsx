import React from 'react';
import { Calendar as CalendarIcon, RotateCcw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const CalendarPage: React.FC = () => {
  const { user, resetToDayZero } = useAuth();
  const currentDay = user?.missionDay ?? 0;
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-emerald-400" />
            <span>30-Day Placement Challenge Calendar</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Track daily completion, upcoming assessment deadlines, and mock interview slots.</p>
        </div>
        <button
          onClick={resetToDayZero}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/40 border border-rose-500/30 hover:border-rose-500 text-rose-300 rounded-xl text-xs font-semibold transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Day 0</span>
        </button>
      </div>

      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
            Placement Month Grid (Day {currentDay} of 30)
          </h2>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Completed</span>
            <span className="flex items-center gap-1 text-purple-400 font-semibold"><span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Today</span>
            <span className="flex items-center gap-1 text-slate-500 font-semibold"><span className="w-2.5 h-2.5 rounded-full bg-slate-700" /> Upcoming</span>
          </div>
        </div>

        <div className="grid grid-cols-5 md:grid-cols-7 gap-2.5">
          {daysInMonth.map((day) => {
            const isCompleted = currentDay > 0 && day <= currentDay;
            const isToday = currentDay > 0 ? day === currentDay : day === 1;

            return (
              <div
                key={day}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  isToday
                    ? 'bg-purple-600/30 border-purple-500 shadow-lg shadow-purple-500/20'
                    : isCompleted
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-400'
                    : 'bg-slate-900/60 border-slate-800 text-slate-500'
                }`}
              >
                <div className="text-xs font-bold">Day {day}</div>
                <div className="text-[10px] mt-1 font-medium">
                  {isToday ? (currentDay === 0 ? '🚀 Day 0' : '⚡ Today') : isCompleted ? '🟢 Done' : '⚪ Scheduled'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

