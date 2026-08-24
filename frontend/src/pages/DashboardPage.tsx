import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Flame,
  Zap,
  Trophy,
  CheckCircle2,
  Clock,
  Target,
  ArrowRight,
  Sparkles,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Code2,
  Briefcase,
  Play,
  Award,
  Check,
  Plus
} from 'lucide-react';
import { Task, DSAProblem } from '../types';

export const DashboardPage: React.FC = () => {
  const { user, refreshUser, updateProfile } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<number>(user?.missionDay ?? 0);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);

  useEffect(() => {
    if (user?.missionDay !== undefined) {
      setSelectedDay(user.missionDay);
    }
  }, [user?.missionDay]);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/dashboard');
      if (res.data.success) {
        setDashboardData(res.data.data);
      }
    } catch (e) {
      console.error('Failed to load dashboard data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [user?.missionDay]);

  const handleCompleteTask = async (taskId: string) => {
    try {
      await api.patch(`/tasks/${taskId}/complete`);
      await fetchDashboard();
      await refreshUser();
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkPlacementAchieved = async () => {
    try {
      await updateProfile({ isMissionCompleted: true });
      setShowCelebrationModal(true);
      await refreshUser();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400">
        <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-semibold uppercase tracking-wider">Syncing Dashboard Data...</p>
      </div>
    );
  }

  const stats = dashboardData?.stats || {
    streak: user?.streak ?? 0,
    bestStreak: user?.bestStreak ?? 0,
    xp: user?.xp ?? 0,
    level: user?.level ?? 1,
    completedTasks: dashboardData?.completedTasks || 0,
    focusTimeFormatted: '0h 0m',
    missionDay: user?.missionDay ?? 0,
    missionProgressPct: Math.round(((user?.missionDay ?? 0) / 30) * 100)
  };

  const defaultTasks: Task[] = dashboardData?.pendingTasks?.length > 0 ? dashboardData.pendingTasks : [
    { _id: '1', title: 'Solve 3 LeetCode Medium Problems (Two Pointer / Window)', category: 'DSA', priority: 'High', dueDate: 'Today', xp: 25, status: 'Pending' },
    { _id: '2', title: 'Practice Quantitative Aptitude: Percentages & Ratio', category: 'Aptitude', priority: 'Medium', dueDate: 'Today', xp: 20, status: 'Pending' },
    { _id: '3', title: 'Record 2-Minute English Self-Introduction', category: 'Communication', priority: 'Medium', dueDate: 'Today', xp: 20, status: 'Pending' },
    { _id: '4', title: 'Technical Mock Interview: Prepare OS & System Design Q&A', category: 'Interview', priority: 'High', dueDate: 'Today', xp: 50, status: 'Pending' },
    { _id: '5', title: 'Watch 1 Episode of Anime / Personal Relaxation Reward', category: 'Relaxation', priority: 'Low', dueDate: 'Today', xp: 10, status: 'Completed' }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-purple-900/40 via-slate-900 to-indigo-950/40 border border-purple-500/30 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-widest mb-1">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Placement Quest Command Center</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            Good Evening, {user?.name || 'Harish'} 👋
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1 font-medium">
            Stay consistent. Master your evening routine. Get Placed 🚀
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={handleMarkPlacementAchieved}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:opacity-95 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all transform hover:scale-105"
          >
            <Trophy className="w-4 h-4" />
            <span>PLACEMENT ACHIEVED 🎉</span>
          </button>
        </div>
      </div>

      {/* 6 Key Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Streak */}
        <div className="glass-card glass-card-hover p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-400">Current Streak</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Flame className="w-4 h-4 fill-amber-400" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-white">{stats.streak} Days</div>
          <div className="text-[10px] text-slate-500 mt-1">Best: {stats.bestStreak} Days</div>
        </div>

        {/* Total XP */}
        <div className="glass-card glass-card-hover p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-400">Total XP</span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Zap className="w-4 h-4 fill-purple-400 text-purple-400" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-purple-300">{stats.xp} XP</div>
          <div className="text-[10px] text-slate-500 mt-1">Next: {300 - (stats.xp % 300)} XP</div>
        </div>

        {/* Level */}
        <div className="glass-card glass-card-hover p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-400">Level</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-emerald-400">Level {stats.level}</div>
          <div className="text-[10px] text-slate-400 font-medium truncate mt-1">{user?.rankTitle || 'DSA Warrior'}</div>
        </div>

        {/* Tasks Completed */}
        <div className="glass-card glass-card-hover p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-400">Tasks Completed</span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-white">{stats.completedTasks}</div>
          <div className="text-[10px] text-slate-500 mt-1">This Month</div>
        </div>

        {/* Focus Time */}
        <div className="glass-card glass-card-hover p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-400">Focus Time</span>
            <div className="w-7 h-7 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-pink-300">{stats.focusTimeFormatted}</div>
          <div className="text-[10px] text-slate-500 mt-1">This Month</div>
        </div>

        {/* Mission Progress */}
        <div className="glass-card glass-card-hover p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-400">Mission Progress</span>
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-cyan-400">{stats.missionProgressPct}%</div>
          <div className="text-[10px] text-slate-500 mt-1">30 Day Challenge</div>
        </div>
      </div>

      {/* Prominent 30-Day Placement Challenge Mission Card (Section 12) */}
      <div className="glass-card p-6 rounded-3xl border border-purple-500/30 bg-gradient-to-br from-slate-900/90 via-purple-950/20 to-slate-900 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
              <Flame className="w-4 h-4 fill-amber-400" />
              <span>30 DAY PLACEMENT CHALLENGE MISSION</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-wide">
              Day {selectedDay} of 30
            </h2>
            <p className="text-xs text-slate-400 italic mt-1">
              "Small progress every day leads to big placement results."
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedDay(Math.max(1, selectedDay - 1))}
              className="p-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-purple-300 px-3 py-1 bg-purple-900/40 rounded-lg border border-purple-500/30">
              Day {selectedDay}
            </span>
            <button
              onClick={() => setSelectedDay(Math.min(30, selectedDay + 1))}
              className="p-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Graphical Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-300">
            <span>Overall Challenge Progress</span>
            <span className="text-emerald-400">{Math.round((selectedDay / 30) * 100)}% Completed</span>
          </div>
          <div className="w-full h-3.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-emerald-400 rounded-full transition-all duration-700 shadow-glow-purple"
              style={{ width: `${(selectedDay / 30) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Plan & Quick Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Evening Plan (Section 13) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-400" />
                <span>Today's Evening Schedule</span>
              </h3>
              <p className="text-xs text-slate-400">Post-college routine (8:00 AM – 5:30 PM College)</p>
            </div>
            <a
              href="/today"
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              <span>Customize Times</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="space-y-2.5">
            {[
              { time: '8:00 AM – 5:30 PM', title: 'College Classes & Academic Lab', tag: 'College', color: 'slate' },
              { time: '6:15 PM – 7:45 PM', title: 'Technical Prep & LeetCode DSA Practice', tag: 'Technical / DSA', color: 'purple' },
              { time: '7:45 PM – 8:15 PM', title: 'Dinner & Relaxation Break', tag: 'Break', color: 'amber' },
              { time: '8:15 PM – 9:00 PM', title: 'Quantitative & Logical Aptitude Practice', tag: 'Aptitude', color: 'emerald' },
              { time: '9:00 PM – 9:30 PM', title: 'Communication & Speaking Practice', tag: 'Communication', color: 'blue' },
              { time: '9:30 PM – 10:15 PM', title: 'Interview Q&A Prep & Mock Session', tag: 'Interview', color: 'pink' },
              { time: '10:15 PM – 11:00 PM', title: 'Anime / Controlled Reward Relaxation Time', tag: 'Relaxation', color: 'cyan' },
              { time: '11:00 PM', title: 'Daily Revision & Sleep Preparation', tag: 'Revision', color: 'indigo' }
            ].map((slot, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="px-2.5 py-1 rounded-lg bg-slate-800 text-[11px] font-bold text-slate-300 border border-slate-700">
                    {slot.time}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-100">{slot.title}</h4>
                    <span className="text-[10px] text-purple-400 font-medium">{slot.tag}</span>
                  </div>
                </div>
                <div className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-emerald-400 bg-emerald-950/20">
                  <Check className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Today's Tasks & Quick Launcher */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Today's Tasks</span>
            </h3>
            <a href="/tasks" className="text-xs font-semibold text-purple-400 hover:text-purple-300">
              View All
            </a>
          </div>

          <div className="space-y-2.5">
            {defaultTasks.map((t) => (
              <div
                key={t._id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  t.status === 'Completed'
                    ? 'bg-slate-950/40 border-slate-900 opacity-60'
                    : 'bg-slate-900/80 border-slate-800 hover:border-purple-500/40'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleCompleteTask(t._id)}
                    className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                      t.status === 'Completed'
                        ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                        : 'border-slate-700 hover:border-purple-400 text-transparent'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </button>
                  <div className="flex-1 min-w-0">
                    <h4
                      className={`text-xs font-semibold ${
                        t.status === 'Completed' ? 'line-through text-slate-500' : 'text-slate-200'
                      }`}
                    >
                      {t.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                        {t.category}
                      </span>
                      <span className="text-[10px] font-bold text-amber-400 flex items-center gap-0.5">
                        +{t.xp} XP
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* DSA & Placement Funnel Quick Summary Widget */}
          <div className="p-4 rounded-2xl glass-card border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-cyan-400" />
              <span>Placement Funnel</span>
            </h4>
            <div className="grid grid-cols-6 gap-1 text-center">
              {[
                { label: 'Applied', val: dashboardData?.applications?.applied || 0, color: 'text-slate-300' },
                { label: 'Assessment', val: dashboardData?.applications?.assessment || 0, color: 'text-purple-400' },
                { label: 'Shortlist', val: dashboardData?.applications?.shortlisted || 0, color: 'text-blue-400' },
                { label: 'Interview', val: dashboardData?.applications?.interview || 0, color: 'text-amber-400' },
                { label: 'Selected', val: dashboardData?.applications?.offer || 0, color: 'text-emerald-400 font-extrabold' },
                { label: 'Rejected', val: dashboardData?.applications?.rejected || 0, color: 'text-rose-400 font-semibold' }
              ].map((st, idx) => (
                <div key={idx} className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className={`text-base font-extrabold ${st.color}`}>{st.val}</div>
                  <div className="text-[9px] text-slate-500 truncate mt-0.5">{st.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Celebration Modal when Placement Achieved is clicked */}
      {showCelebrationModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card max-w-lg w-full p-8 rounded-3xl border border-emerald-500/50 text-center space-y-6 relative overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-300 flex items-center justify-center shadow-2xl shadow-emerald-500/50">
              <Trophy className="w-10 h-10 text-slate-950" />
            </div>

            <div>
              <h2 className="text-3xl font-black text-white tracking-tight">🎉 MISSION COMPLETE 🎉</h2>
              <div className="text-xl font-bold text-emerald-400 uppercase tracking-widest mt-1">
                PLACEMENT ACHIEVED!
              </div>
              <p className="text-xs text-slate-300 mt-2">
                30 Days Completed • You stayed consistent and conquered campus placements!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
              <div><span className="text-slate-400">DSA Solved:</span> <strong className="text-purple-300">100+</strong></div>
              <div><span className="text-slate-400">Tasks Completed:</span> <strong className="text-emerald-400">200+</strong></div>
              <div><span className="text-slate-400">Study Hours:</span> <strong className="text-pink-300">100+</strong></div>
              <div><span className="text-slate-400">Applications:</span> <strong className="text-cyan-300">30+</strong></div>
            </div>

            <button
              onClick={() => setShowCelebrationModal(false)}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/30 transition-all hover:scale-105"
            >
              GET PLACED 🚀
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
