import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Clock, Plus, Play, Pause, RotateCcw, X } from 'lucide-react';
import { StudySession } from '../types';

export const StudyTimePage: React.FC = () => {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [breakdown, setBreakdown] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Live Timer State
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const fetchStudyTime = async () => {
    try {
      const res = await api.get('/study-time');
      if (res.data.success) {
        setSessions(res.data.sessions);
        setTotalMinutes(res.data.totalMinutes);
        setBreakdown(res.data.categoryBreakdown);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudyTime();
  }, []);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (sec: number) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;
    return `${hrs > 0 ? `${hrs}:` : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSaveTimerSession = async () => {
    const mins = Math.max(1, Math.round(timerSeconds / 60));
    try {
      await api.post('/study-time', {
        subject: 'Live Focused Placement Study',
        category: 'Technical / DSA',
        startTime: '19:00',
        endTime: '20:30',
        durationMinutes: mins
      });
      setIsTimerRunning(false);
      setTimerSeconds(0);
      await fetchStudyTime();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="py-20 text-center text-slate-400">Loading Study Time tracker...</div>;

  const totalHours = Math.floor(totalMinutes / 60);
  const totalMinsRem = totalMinutes % 60;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
          <Clock className="w-6 h-6 text-pink-400" />
          <span>Study Time Tracker & Focus Timer</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Track focused evening study sessions across DSA, Aptitude, and Technical prep.</p>
      </div>

      {/* Live Focus Stopwatch Timer Widget */}
      <div className="glass-card p-6 rounded-3xl border border-pink-500/30 bg-gradient-to-r from-pink-950/20 via-slate-900 to-purple-950/20 text-center space-y-4 shadow-2xl">
        <span className="text-xs font-bold text-pink-400 uppercase tracking-widest">LIVE FOCUS STOPWATCH</span>
        <div className="text-5xl font-black text-white tracking-widest font-mono">
          {formatTimer(timerSeconds)}
        </div>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-pink-500/30 flex items-center gap-2"
          >
            {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isTimerRunning ? 'Pause Session' : 'Start Focus Session'}</span>
          </button>
          {timerSeconds > 0 && (
            <button
              onClick={handleSaveTimerSession}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20"
            >
              Log Session ({Math.round(timerSeconds / 60)} mins)
            </button>
          )}
        </div>
      </div>

      {/* Category Hours Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="glass-card p-4 rounded-2xl border border-slate-800">
          <div className="text-xl font-extrabold text-white">{totalHours}h {totalMinsRem}m</div>
          <div className="text-[10px] font-semibold text-slate-400 uppercase mt-0.5">Total Study Time</div>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-purple-500/30">
          <div className="text-xl font-extrabold text-purple-300">
            {Math.floor((breakdown['Technical / DSA'] || 0) / 60)}h {(breakdown['Technical / DSA'] || 0) % 60}m
          </div>
          <div className="text-[10px] font-semibold text-purple-400 uppercase mt-0.5">Technical / DSA</div>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-emerald-500/30">
          <div className="text-xl font-extrabold text-emerald-400">
            {Math.floor((breakdown['Aptitude'] || 0) / 60)}h {(breakdown['Aptitude'] || 0) % 60}m
          </div>
          <div className="text-[10px] font-semibold text-emerald-400 uppercase mt-0.5">Aptitude</div>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-blue-500/30">
          <div className="text-xl font-extrabold text-blue-300">
            {Math.floor((breakdown['Interview'] || 0) / 60)}h {(breakdown['Interview'] || 0) % 60}m
          </div>
          <div className="text-[10px] font-semibold text-blue-400 uppercase mt-0.5">Interview & Comm</div>
        </div>
      </div>

      {/* Log History */}
      <div className="space-y-3">
        {sessions.map((s) => (
          <div key={s._id} className="p-4 rounded-2xl glass-card border border-slate-800 flex items-center justify-between">
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-pink-500/10 text-pink-300 border border-pink-500/20">
                {s.category}
              </span>
              <h3 className="text-sm font-semibold text-slate-100 mt-1">{s.subject}</h3>
              <span className="text-[10px] text-slate-500">{s.date} • {s.startTime} - {s.endTime}</span>
            </div>
            <div className="text-base font-extrabold text-pink-400">
              {s.durationMinutes} mins
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
