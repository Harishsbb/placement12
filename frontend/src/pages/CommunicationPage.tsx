import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { MessageSquare, Plus, X, Mic, Trash2 } from 'lucide-react';
import { CommunicationSession } from '../types';

export const CommunicationPage: React.FC = () => {
  const [sessions, setSessions] = useState<CommunicationSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [newSession, setNewSession] = useState({
    type: 'Self Introduction',
    duration: 30,
    topic: '2-Minute Elevator Pitch & Self Intro',
    confidence: 8,
    notes: 'Practiced speaking fluently without filler words.'
  });

  const fetchSessions = async () => {
    try {
      const res = await api.get('/communication');
      if (res.data.success) setSessions(res.data.sessions);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/communication', newSession);
      setShowModal(false);
      await fetchSessions();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/communication/${id}`);
      await fetchSessions();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="py-20 text-center text-slate-400">Loading Communication practice...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-blue-400" />
            <span>Communication & GD Preparation</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Practice English speaking, vocabulary, group discussion & self introduction.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/25 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Log Practice Session</span>
        </button>
      </div>

      <div className="space-y-3">
        {sessions.length === 0 ? (
          <div className="p-12 text-center text-slate-500 glass-card rounded-2xl">
            No communication practice sessions logged yet.
          </div>
        ) : (
          sessions.map((s) => (
            <div key={s._id} className="p-4 rounded-2xl glass-card border border-slate-800 flex items-center justify-between">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-300 border border-blue-500/20">
                  {s.type}
                </span>
                <h3 className="text-sm font-semibold text-slate-100 mt-1">{s.topic}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{s.notes}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm font-bold text-amber-400">Confidence: {s.confidence}/10</div>
                  <div className="text-[10px] text-slate-500">{s.duration} mins</div>
                </div>
                <button
                  onClick={() => handleDelete(s._id)}
                  className="p-2 text-slate-500 hover:text-rose-400 rounded-xl hover:bg-slate-800 transition-colors"
                  title="Delete Session"
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
              <h3 className="text-sm font-bold text-white">Log Communication Session</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Session Type</label>
                <select
                  value={newSession.type}
                  onChange={(e) => setNewSession({ ...newSession, type: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100"
                >
                  <option value="Self Introduction">Self Introduction</option>
                  <option value="Speaking Practice">Speaking Practice</option>
                  <option value="Group Discussion">Group Discussion (GD)</option>
                  <option value="Vocabulary">Vocabulary & Grammar</option>
                  <option value="Presentation">Presentation Practice</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Topic / Notes</label>
                <input
                  type="text"
                  required
                  value={newSession.topic}
                  onChange={(e) => setNewSession({ ...newSession, topic: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/25"
              >
                Log Communication Session (+20 XP)
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
