import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Briefcase,
  Plus,
  Trash2,
  X,
  CheckCircle2,
  XCircle,
  Clock,
  Edit3,
  Check,
  Building2,
  FileText,
  Filter
} from 'lucide-react';
import { JobApplication } from '../types';

export const ApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [funnel, setFunnel] = useState<any>({
    applied: 0,
    assessment: 0,
    shortlisted: 0,
    interview: 0,
    offer: 0,
    rejected: 0
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState<string>('');

  const [newApp, setNewApp] = useState({
    company: '',
    jobRole: 'Software Engineer',
    location: 'Bengaluru / Hybrid',
    salary: '14 - 20 LPA',
    status: 'Applied' as JobApplication['status'],
    appliedDate: new Date().toISOString().split('T')[0],
    interviewDate: '',
    notes: ''
  });

  const fetchApps = async () => {
    try {
      const res = await api.get('/applications');
      if (res.data.success) {
        setApplications(res.data.applications);
        setFunnel(res.data.funnel || {});
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/applications', newApp);
      setShowModal(false);
      setNewApp({
        company: '',
        jobRole: 'Software Engineer',
        location: 'Bengaluru / Hybrid',
        salary: '14 - 20 LPA',
        status: 'Applied',
        appliedDate: new Date().toISOString().split('T')[0],
        interviewDate: '',
        notes: ''
      });
      await fetchApps();
    } catch (e) {
      console.error(e);
    }
  };

  const handleStatusChange = async (id: string, newStatus: JobApplication['status']) => {
    try {
      await api.put(`/applications/${id}`, { status: newStatus });
      setApplications((prev) =>
        prev.map((app) => (app._id === id ? { ...app, status: newStatus } : app))
      );
      await fetchApps();
    } catch (e) {
      console.error('Failed to update status', e);
    }
  };

  const handleSaveNotes = async (id: string) => {
    try {
      await api.put(`/applications/${id}`, { notes: tempNotes });
      setApplications((prev) =>
        prev.map((app) => (app._id === id ? { ...app, notes: tempNotes } : app))
      );
      setEditingNotesId(null);
    } catch (e) {
      console.error('Failed to save notes', e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/applications/${id}`);
      await fetchApps();
    } catch (e) {
      console.error(e);
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (filterStatus === 'All') return true;
    if (filterStatus === 'Offer') return app.status === 'Offer';
    if (filterStatus === 'Rejected') return app.status === 'Rejected';
    return app.status === filterStatus;
  });

  if (loading) return <div className="py-20 text-center text-slate-400">Loading Job Applications...</div>;

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-cyan-400" />
            <span>Job Application Tracker</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track company applications, assessment dates, interview stages, selection outcomes, and rejections.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/25 flex items-center gap-2 transition-transform hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Add Application</span>
        </button>
      </div>

      {/* 6 Metric Funnel Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { key: 'Applied', label: 'Applied', val: funnel.applied || 0, color: 'text-slate-300', bg: 'hover:border-slate-700' },
          { key: 'Assessment', label: 'Assessment', val: funnel.assessment || 0, color: 'text-purple-400', bg: 'hover:border-purple-500/50' },
          { key: 'Shortlisted', label: 'Shortlisted', val: funnel.shortlisted || 0, color: 'text-blue-400', bg: 'hover:border-blue-500/50' },
          { key: 'Interview', label: 'Interview', val: funnel.interview || 0, color: 'text-amber-400', bg: 'hover:border-amber-500/50' },
          { key: 'Offer', label: 'Selected / Offer', val: funnel.offer || 0, color: 'text-emerald-400 font-extrabold', bg: 'hover:border-emerald-500/50' },
          { key: 'Rejected', label: 'Rejected', val: funnel.rejected || 0, color: 'text-rose-400 font-semibold', bg: 'hover:border-rose-500/50' }
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilterStatus(filterStatus === f.key ? 'All' : f.key)}
            className={`glass-card p-3.5 rounded-2xl text-center border transition-all ${
              filterStatus === f.key ? 'bg-purple-900/30 border-purple-500' : 'border-slate-800 ' + f.bg
            }`}
          >
            <div className={`text-xl font-black ${f.color}`}>{f.val}</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 truncate">{f.label}</div>
          </button>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-500 font-semibold flex items-center gap-1 mr-1">
          <Filter className="w-3.5 h-3.5" /> Filter:
        </span>
        {['All', 'Applied', 'Assessment', 'Shortlisted', 'Interview', 'Offer', 'Rejected'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
              filterStatus === st
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {st === 'Offer' ? '🎉 Selected (Offer)' : st === 'Rejected' ? '❌ Rejected' : st}
          </button>
        ))}
      </div>

      {/* Applications List */}
      <div className="space-y-3">
        {filteredApplications.length === 0 ? (
          <div className="p-12 text-center glass-card rounded-3xl border border-slate-800 text-slate-400">
            <Building2 className="w-10 h-10 mx-auto text-slate-600 mb-2" />
            <p className="text-sm font-semibold">No applications found under this status.</p>
            <p className="text-xs text-slate-500 mt-1">Click "Add Application" to track your job applications!</p>
          </div>
        ) : (
          filteredApplications.map((app) => {
            const isOffer = app.status === 'Offer';
            const isRejected = app.status === 'Rejected';

            return (
              <div
                key={app._id}
                className={`p-4 rounded-3xl glass-card border transition-all space-y-3 ${
                  isOffer
                    ? 'border-emerald-500/40 bg-emerald-950/10'
                    : isRejected
                    ? 'border-rose-500/30 bg-rose-950/10'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  {/* Left Info */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-extrabold text-white">{app.company}</h3>

                      {/* Interactive Status Selector Dropdown */}
                      <div className="relative">
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app._id, e.target.value as JobApplication['status'])}
                          className={`px-2.5 py-1 rounded-xl text-xs font-bold border cursor-pointer focus:outline-none transition-all ${
                            isOffer
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : isRejected
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                              : app.status === 'Interview'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : app.status === 'Assessment'
                              ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                              : app.status === 'Shortlisted'
                              ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                              : 'bg-slate-900 text-slate-300 border-slate-700'
                          }`}
                        >
                          <option value="Wishlist">⏸️ Wishlist</option>
                          <option value="Applied">📩 Applied</option>
                          <option value="Assessment">✍️ Assessment</option>
                          <option value="Shortlisted">🎯 Shortlisted</option>
                          <option value="Interview">🎙️ Interview / HR</option>
                          <option value="Offer">🎉 Selected (Offer)</option>
                          <option value="Rejected">❌ Rejected</option>
                          <option value="Withdrawn">🚫 Withdrawn</option>
                        </select>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 font-medium">
                      {app.jobRole} • <span className="text-emerald-400 font-semibold">{app.salary}</span>
                    </p>
                    <div className="text-[11px] text-slate-400 flex items-center gap-3">
                      <span>📍 {app.location}</span>
                      <span>📅 Applied: {app.appliedDate}</span>
                      {app.interviewDate && <span>🎙️ Interview: {app.interviewDate}</span>}
                    </div>
                  </div>

                  {/* Right Actions: Direct Outcome Buttons & Delete */}
                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    {/* Quick Outcome Toggle Buttons */}
                    <button
                      onClick={() => handleStatusChange(app._id, 'Offer')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
                        isOffer
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                          : 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30 hover:bg-emerald-900/60'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isOffer ? 'Selected 🎉' : 'Select / Offer'}</span>
                    </button>

                    <button
                      onClick={() => handleStatusChange(app._id, 'Rejected')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
                        isRejected
                          ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-500/20'
                          : 'bg-rose-950/40 text-rose-400 border-rose-500/30 hover:bg-rose-900/60'
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>{isRejected ? 'Rejected ❌' : 'Reject'}</span>
                    </button>

                    <button
                      onClick={() => handleDelete(app._id)}
                      className="p-2 text-slate-500 hover:text-rose-400 rounded-xl hover:bg-slate-800 transition-colors"
                      title="Delete Application"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Notes & Outcome Details Section */}
                <div className="pt-2 border-t border-slate-800/80">
                  {editingNotesId === app._id ? (
                    <div className="space-y-2">
                      <textarea
                        value={tempNotes}
                        onChange={(e) => setTempNotes(e.target.value)}
                        placeholder="Mention assessment feedback, test date, interview round notes, or final result..."
                        className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
                        rows={2}
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingNotesId(null)}
                          className="px-2.5 py-1 text-xs text-slate-400 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveNotes(app._id)}
                          className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" /> Save Note
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-1.5 italic">
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        <span>{app.notes || 'No assessment or interview notes added yet.'}</span>
                      </div>
                      <button
                        onClick={() => {
                          setEditingNotesId(app._id);
                          setTempNotes(app.notes || '');
                        }}
                        className="text-purple-400 hover:text-purple-300 text-[11px] font-semibold flex items-center gap-1 ml-2"
                      >
                        <Edit3 className="w-3 h-3" /> Mention Details
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Application Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-purple-400" />
                <span>Add Job Application</span>
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={newApp.company}
                  onChange={(e) => setNewApp({ ...newApp, company: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100"
                  placeholder="Google / Microsoft / Amazon / TCS"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Job Role</label>
                <input
                  type="text"
                  required
                  value={newApp.jobRole}
                  onChange={(e) => setNewApp({ ...newApp, jobRole: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100"
                  placeholder="Software Engineer (SDE-1)"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Current Status</label>
                  <select
                    value={newApp.status}
                    onChange={(e) => setNewApp({ ...newApp, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 font-medium"
                  >
                    <option value="Applied">📩 Applied</option>
                    <option value="Assessment">✍️ Assessment</option>
                    <option value="Shortlisted">🎯 Shortlisted</option>
                    <option value="Interview">🎙️ Interview / HR</option>
                    <option value="Offer">🎉 Selected (Offer)</option>
                    <option value="Rejected">❌ Rejected</option>
                    <option value="Wishlist">⏸️ Wishlist</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Salary / Package</label>
                  <input
                    type="text"
                    value={newApp.salary}
                    onChange={(e) => setNewApp({ ...newApp, salary: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100"
                    placeholder="14 - 20 LPA"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Notes / Mentions</label>
                <textarea
                  value={newApp.notes}
                  onChange={(e) => setNewApp({ ...newApp, notes: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 h-16"
                  placeholder="e.g. Attended online assessment on Aug 24. Awaiting result."
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/25 mt-2"
              >
                Log Job Application (+20 XP)
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

