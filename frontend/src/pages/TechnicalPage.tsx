import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Cpu, Plus, CheckCircle2, BookOpen, X } from 'lucide-react';
import { TechnicalTopic } from '../types';

export const TechnicalPage: React.FC = () => {
  const [topics, setTopics] = useState<TechnicalTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [newTopic, setNewTopic] = useState({
    category: 'Core CS',
    topicName: '',
    status: 'Learning',
    notes: ''
  });

  const fetchTopics = async () => {
    try {
      const res = await api.get('/technical');
      if (res.data.success) {
        setTopics(res.data.topics);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/technical', newTopic);
      setShowModal(false);
      setNewTopic({ category: 'Core CS', topicName: '', status: 'Learning', notes: '' });
      await fetchTopics();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="py-20 text-center text-slate-400">Loading Technical Prep topics...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            <Cpu className="w-6 h-6 text-cyan-400" />
            <span>Technical CS Preparation</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Master Core CS fundamentals: Java, OOP, OS, DBMS, Networks, Web Dev.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/25 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Technical Topic</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {topics.map((t) => (
          <div key={t._id} className="p-4 rounded-2xl glass-card border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                {t.category}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  t.status === 'Mastered'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}
              >
                {t.status}
              </span>
            </div>

            <h3 className="text-sm font-bold text-slate-100">{t.topicName}</h3>
            {t.notes && <p className="text-xs text-slate-400">{t.notes}</p>}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Add Technical Topic</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={newTopic.category}
                  onChange={(e) => setNewTopic({ ...newTopic, category: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100"
                >
                  <option value="Programming">Programming (Java/JS/C++)</option>
                  <option value="DSA">DSA Theory & Patterns</option>
                  <option value="Database">Database & DBMS</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Core CS">Core CS (OS/Networks/OOP)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Topic Name</label>
                <input
                  type="text"
                  required
                  value={newTopic.topicName}
                  onChange={(e) => setNewTopic({ ...newTopic, topicName: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100"
                  placeholder="Process Synchronization & Deadlocks"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Notes / Key Concepts</label>
                <textarea
                  value={newTopic.notes}
                  onChange={(e) => setNewTopic({ ...newTopic, notes: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 h-20"
                  placeholder="Bankers Algorithm, Semaphores, Mutex locks..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/25"
              >
                Save Technical Topic
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
