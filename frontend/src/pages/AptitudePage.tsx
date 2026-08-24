import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Calculator, Plus, X, Award, Trash2 } from 'lucide-react';
import { AptitudeRecord } from '../types';

export const AptitudePage: React.FC = () => {
  const [records, setRecords] = useState<AptitudeRecord[]>([]);
  const [stats, setStats] = useState<any>({ totalAttempted: 0, totalCorrect: 0, overallAccuracy: 0 });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [newRecord, setNewRecord] = useState({
    section: 'Quantitative',
    topic: 'Percentages & Profit Loss',
    questionsAttempted: 20,
    correct: 17,
    timeTaken: 25
  });

  const fetchAptitude = async () => {
    try {
      const res = await api.get('/aptitude');
      if (res.data.success) {
        setRecords(res.data.records);
        setStats(res.data.stats);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAptitude();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/aptitude', newRecord);
      setShowModal(false);
      await fetchAptitude();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/aptitude/${id}`);
      await fetchAptitude();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="py-20 text-center text-slate-400">Loading Aptitude tracker...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            <Calculator className="w-6 h-6 text-emerald-400" />
            <span>Aptitude Practice Tracker</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Quantitative, Logical Reasoning & Verbal Ability prep for company assessments.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/25 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Log Aptitude Test</span>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card p-4 rounded-2xl text-center border border-slate-800">
          <div className="text-2xl font-black text-white">{stats.totalAttempted}</div>
          <div className="text-[11px] font-semibold text-slate-400 uppercase mt-0.5">Attempted</div>
        </div>
        <div className="glass-card p-4 rounded-2xl text-center border border-emerald-500/30">
          <div className="text-2xl font-black text-emerald-400">{stats.totalCorrect}</div>
          <div className="text-[11px] font-semibold text-emerald-400 uppercase mt-0.5">Correct</div>
        </div>
        <div className="glass-card p-4 rounded-2xl text-center border border-purple-500/30">
          <div className="text-2xl font-black text-purple-300">{stats.overallAccuracy}%</div>
          <div className="text-[11px] font-semibold text-purple-300 uppercase mt-0.5">Accuracy</div>
        </div>
      </div>

      <div className="space-y-3">
        {records.length === 0 ? (
          <div className="p-12 text-center text-slate-500 glass-card rounded-2xl">
            No aptitude sessions recorded yet. Log your test scores to track accuracy.
          </div>
        ) : (
          records.map((r) => (
            <div key={r._id} className="p-4 rounded-2xl glass-card border border-slate-800 flex items-center justify-between">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {r.section}
                </span>
                <h3 className="text-sm font-semibold text-slate-100 mt-1">{r.topic}</h3>
                <div className="text-xs text-slate-400 mt-0.5">
                  {r.correct} / {r.questionsAttempted} Correct • {r.timeTaken} mins
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-lg font-black text-emerald-400">{r.accuracy}%</div>
                  <div className="text-[10px] text-slate-500">Accuracy</div>
                </div>
                <button
                  onClick={() => handleDelete(r._id)}
                  className="p-2 text-slate-500 hover:text-rose-400 rounded-xl hover:bg-slate-800 transition-colors"
                  title="Delete Record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Log Aptitude Session</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Section</label>
                <select
                  value={newRecord.section}
                  onChange={(e) => setNewRecord({ ...newRecord, section: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100"
                >
                  <option value="Quantitative">Quantitative</option>
                  <option value="Logical Reasoning">Logical Reasoning</option>
                  <option value="Verbal Ability">Verbal Ability</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Topic</label>
                <input
                  type="text"
                  required
                  value={newRecord.topic}
                  onChange={(e) => setNewRecord({ ...newRecord, topic: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100"
                  placeholder="Percentages / Series / Syllogisms"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Questions Attempted</label>
                  <input
                    type="number"
                    required
                    value={newRecord.questionsAttempted}
                    onChange={(e) => setNewRecord({ ...newRecord, questionsAttempted: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Correct Answers</label>
                  <input
                    type="number"
                    required
                    value={newRecord.correct}
                    onChange={(e) => setNewRecord({ ...newRecord, correct: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/25 mt-2"
              >
                Log Aptitude Record (+20 XP)
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
