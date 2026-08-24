import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Mic, Plus, Trophy, Award, X, Trash2 } from 'lucide-react';
import { Interview } from '../types';

export const InterviewPage: React.FC = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [newInterview, setNewInterview] = useState({
    company: 'Amazon',
    round: 'Round 1 Technical',
    type: 'Mock Interview',
    date: new Date().toISOString().split('T')[0],
    feedback: 'Great problem solving on arrays. Need to clarify edge cases faster.',
    scoring: {
      technicalKnowledge: 85,
      communication: 80,
      confidence: 75,
      problemSolving: 90,
      projectKnowledge: 85,
      overallScore: 83
    }
  });

  const fetchInterviews = async () => {
    try {
      const res = await api.get('/interviews');
      if (res.data.success) setInterviews(res.data.interviews);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/interviews', newInterview);
      setShowModal(false);
      await fetchInterviews();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/interviews/${id}`);
      await fetchInterviews();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="py-20 text-center text-slate-400">Loading Mock Interviews...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            <Mic className="w-6 h-6 text-pink-400" />
            <span>Interview Practice & Mock Scoring</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Log technical & HR mock interview sessions with score breakdowns.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/25 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Log Mock Interview</span>
        </button>
      </div>

      <div className="space-y-4">
        {interviews.length === 0 ? (
          <div className="p-12 text-center text-slate-500 glass-card rounded-2xl">
            No interview sessions logged yet. Log your mock interviews to track your score breakdowns!
          </div>
        ) : (
          interviews.map((iv) => (
            <div key={iv._id} className="p-5 rounded-3xl glass-card border border-slate-800 space-y-3 relative group">
              <div className="flex items-center justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/10 text-pink-300 border border-pink-500/20">
                    {iv.type}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1">{iv.company} — {iv.round}</h3>
                  <span className="text-[11px] text-slate-400">{iv.date}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-2xl font-black text-pink-400">{iv.scoring?.overallScore || 80}/100</div>
                    <div className="text-[10px] text-slate-500 font-semibold uppercase">Overall Score</div>
                  </div>
                  <button
                    onClick={() => handleDelete(iv._id)}
                    className="p-2 text-slate-500 hover:text-rose-400 rounded-xl hover:bg-slate-800/80 transition-colors"
                    title="Delete Interview Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            {iv.feedback && (
              <p className="text-xs text-slate-300 italic bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                "{iv.feedback}"
              </p>
            )}

            {/* Score Breakdown Radar/Grid */}
            <div className="grid grid-cols-5 gap-2 text-center text-xs pt-2 border-t border-slate-800">
              <div>
                <div className="font-bold text-purple-300">{iv.scoring?.technicalKnowledge}%</div>
                <div className="text-[9px] text-slate-500 truncate">Technical</div>
              </div>
              <div>
                <div className="font-bold text-blue-300">{iv.scoring?.communication}%</div>
                <div className="text-[9px] text-slate-500 truncate">Comm</div>
              </div>
              <div>
                <div className="font-bold text-amber-300">{iv.scoring?.confidence}%</div>
                <div className="text-[9px] text-slate-500 truncate">Confidence</div>
              </div>
              <div>
                <div className="font-bold text-emerald-300">{iv.scoring?.problemSolving}%</div>
                <div className="text-[9px] text-slate-500 truncate">Problem Solv</div>
              </div>
              <div>
                <div className="font-bold text-cyan-300">{iv.scoring?.projectKnowledge}%</div>
                <div className="text-[9px] text-slate-500 truncate">Project</div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Log Mock Interview</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Company / Target</label>
                <input
                  type="text"
                  required
                  value={newInterview.company}
                  onChange={(e) => setNewInterview({ ...newInterview, company: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Feedback / Notes</label>
                <textarea
                  value={newInterview.feedback}
                  onChange={(e) => setNewInterview({ ...newInterview, feedback: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 h-20"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/25"
              >
                Log Mock Interview (+50 XP)
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
