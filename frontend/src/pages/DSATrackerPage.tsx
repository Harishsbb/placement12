import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Code2, Plus, ExternalLink, Trash2, CheckCircle2, X } from 'lucide-react';
import { DSAProblem } from '../types';

export const DSATrackerPage: React.FC = () => {
  const { refreshUser } = useAuth();
  const [problems, setProblems] = useState<DSAProblem[]>([]);
  const [stats, setStats] = useState<any>({ totalSolved: 0, easyCount: 0, mediumCount: 0, hardCount: 0 });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [newProblem, setNewProblem] = useState({
    problemName: '',
    platform: 'LeetCode',
    difficulty: 'Medium',
    topic: 'Arrays',
    solvedDate: new Date().toISOString().split('T')[0],
    timeTaken: 30,
    solutionLink: '',
    notes: ''
  });

  const fetchDSA = async () => {
    try {
      const res = await api.get('/dsa');
      if (res.data.success) {
        setProblems(res.data.problems);
        setStats(res.data.stats);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDSA();
  }, []);

  const handleAddProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/dsa', newProblem);
      setShowModal(false);
      setNewProblem({
        problemName: '',
        platform: 'LeetCode',
        difficulty: 'Medium',
        topic: 'Arrays',
        solvedDate: new Date().toISOString().split('T')[0],
        timeTaken: 30,
        solutionLink: '',
        notes: ''
      });
      await fetchDSA();
      await refreshUser();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/dsa/${id}`);
      await fetchDSA();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="py-20 text-center text-slate-400">Loading DSA tracker...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            <Code2 className="w-6 h-6 text-purple-400" />
            <span>DSA Preparation Tracker</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Log solved LeetCode/GFG problems to level up your DSA Warrior status.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/25 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Log DSA Problem</span>
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-3">
        <div className="glass-card p-4 rounded-2xl text-center border border-slate-800">
          <div className="text-2xl font-black text-white">{stats.totalSolved}</div>
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Total Solved</div>
        </div>
        <div className="glass-card p-4 rounded-2xl text-center border border-emerald-500/30">
          <div className="text-2xl font-black text-emerald-400">{stats.easyCount}</div>
          <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider mt-0.5">Easy</div>
        </div>
        <div className="glass-card p-4 rounded-2xl text-center border border-amber-500/30">
          <div className="text-2xl font-black text-amber-400">{stats.mediumCount}</div>
          <div className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider mt-0.5">Medium</div>
        </div>
        <div className="glass-card p-4 rounded-2xl text-center border border-rose-500/30">
          <div className="text-2xl font-black text-rose-400">{stats.hardCount}</div>
          <div className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider mt-0.5">Hard</div>
        </div>
      </div>

      {/* Problem Table / Cards */}
      <div className="space-y-3">
        {problems.length === 0 ? (
          <div className="p-12 text-center text-slate-500 glass-card rounded-2xl">
            No DSA problems logged yet. Start solving and track your progress!
          </div>
        ) : (
          problems.map((p) => (
            <div
              key={p._id}
              className="p-4 rounded-2xl glass-card border border-slate-800 hover:border-purple-500/40 flex items-center justify-between gap-4 transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-xs">
                  {p.platform[0]}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-slate-100 truncate">{p.problemName}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-800 text-purple-300 border border-slate-700">
                      {p.topic}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                        p.difficulty === 'Easy'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : p.difficulty === 'Medium'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {p.difficulty}
                    </span>
                    <span className="text-[10px] text-slate-500">{p.timeTaken} mins</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {p.solutionLink && (
                  <a
                    href={p.solutionLink}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-slate-400 hover:text-purple-300 rounded-lg hover:bg-slate-800"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <button
                  onClick={() => handleDelete(p._id)}
                  className="p-2 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Log Problem Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Log Solved DSA Problem</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddProblem} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Problem Title</label>
                <input
                  type="text"
                  required
                  value={newProblem.problemName}
                  onChange={(e) => setNewProblem({ ...newProblem, problemName: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:border-purple-500"
                  placeholder="e.g. 3Sum / Trapping Rain Water"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Difficulty</label>
                  <select
                    value={newProblem.difficulty}
                    onChange={(e) => setNewProblem({ ...newProblem, difficulty: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Topic</label>
                  <select
                    value={newProblem.topic}
                    onChange={(e) => setNewProblem({ ...newProblem, topic: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100"
                  >
                    <option value="Arrays">Arrays</option>
                    <option value="Strings">Strings</option>
                    <option value="Two Pointer">Two Pointer</option>
                    <option value="Sliding Window">Sliding Window</option>
                    <option value="HashMap">HashMap</option>
                    <option value="Trees">Trees</option>
                    <option value="Graphs">Graphs</option>
                    <option value="Dynamic Programming">Dynamic Programming</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Solution Link (Optional)</label>
                <input
                  type="text"
                  value={newProblem.solutionLink}
                  onChange={(e) => setNewProblem({ ...newProblem, solutionLink: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:border-purple-500"
                  placeholder="https://leetcode.com/problems/..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/25 mt-2"
              >
                Log Problem (+25 XP)
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
