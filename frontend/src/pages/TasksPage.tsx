import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CheckSquare, Plus, Check, Trash2, Filter, Zap, X } from 'lucide-react';
import { Task } from '../types';

export const TasksPage: React.FC = () => {
  const { refreshUser } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showModal, setShowModal] = useState(false);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    category: 'DSA',
    priority: 'Medium',
    dueDate: new Date().toISOString().split('T')[0],
    xp: 25,
    isRecurring: false
  });

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      if (res.data.success) {
        setTasks(res.data.tasks);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/tasks', newTask);
      setShowModal(false);
      setNewTask({
        title: '',
        description: '',
        category: 'DSA',
        priority: 'Medium',
        dueDate: new Date().toISOString().split('T')[0],
        xp: 25,
        isRecurring: false
      });
      await fetchTasks();
    } catch (e) {
      console.error(e);
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await api.patch(`/tasks/${id}/complete`);
      await fetchTasks();
      await refreshUser();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/tasks/${id}`);
      await fetchTasks();
    } catch (e) {
      console.error(e);
    }
  };

  const categories = ['All', 'Technical', 'DSA', 'Aptitude', 'Communication', 'Interview', 'Project', 'Application', 'Relaxation'];

  const filteredTasks = selectedCategory === 'All'
    ? tasks
    : tasks.filter(t => t.category === selectedCategory);

  if (loading) {
    return <div className="py-20 text-center text-slate-400">Loading placement tasks...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-emerald-400" />
            <span>Daily Task System</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Complete daily tasks to gain XP, level up, and maintain your streak.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/25 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Task</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center text-slate-500 glass-card rounded-2xl">
            <p className="text-xs font-medium">No tasks found for this category.</p>
          </div>
        ) : (
          filteredTasks.map((t) => (
            <div
              key={t._id}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                t.status === 'Completed'
                  ? 'bg-slate-950/40 border-slate-900 opacity-60'
                  : 'bg-slate-900/80 border-slate-800 hover:border-purple-500/40'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => handleComplete(t._id)}
                  className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors ${
                    t.status === 'Completed'
                      ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                      : 'border-slate-700 hover:border-purple-400 text-transparent'
                  }`}
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                </button>
                <div className="min-w-0">
                  <h3 className={`text-sm font-semibold truncate ${t.status === 'Completed' ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                    {t.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      {t.category}
                    </span>
                    <span className="text-[10px] font-bold text-amber-400 flex items-center gap-0.5">
                      +{t.xp} XP
                    </span>
                    <span className="text-[10px] text-slate-500">{t.dueDate}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleDelete(t._id)}
                className="p-2 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* New Task Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Create New Task</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:border-purple-500"
                  placeholder="Solve 3 LeetCode Medium problems"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={newTask.category}
                    onChange={(e) => setNewTask({ ...newTask, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100"
                  >
                    <option value="DSA">DSA</option>
                    <option value="Technical">Technical</option>
                    <option value="Aptitude">Aptitude</option>
                    <option value="Communication">Communication</option>
                    <option value="Interview">Interview</option>
                    <option value="Project">Project</option>
                    <option value="Application">Application</option>
                    <option value="Relaxation">Relaxation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">XP Reward</label>
                  <select
                    value={newTask.xp}
                    onChange={(e) => setNewTask({ ...newTask, xp: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100"
                  >
                    <option value={10}>+10 XP (Easy)</option>
                    <option value={25}>+25 XP (Medium)</option>
                    <option value={50}>+50 XP (Hard)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/25 mt-2"
              >
                Create Task
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
