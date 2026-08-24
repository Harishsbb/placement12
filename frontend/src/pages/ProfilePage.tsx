import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User as UserIcon, Mail, GraduationCap, Target, Save, Award, Flame, Zap } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    college: user?.college || '',
    degree: user?.degree || '',
    graduationYear: user?.graduationYear || '',
    targetRole: user?.targetRole || '',
    profileImage: user?.profileImage || ''
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      await updateProfile(formData);
      setMsg('Profile updated successfully!');
    } catch (e: any) {
      setMsg(e.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
          <UserIcon className="w-6 h-6 text-purple-400" />
          <span>Student Profile & Placement Goals</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Manage personal details, target roles, and college credentials.</p>
      </div>

      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-6">
        {/* User Card Badge */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <img
            src={user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt="Profile"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-500/40"
          />
          <div>
            <h2 className="text-lg font-bold text-white">{user?.name}</h2>
            <div className="text-xs text-purple-400 font-semibold">{user?.rankTitle || 'DSA Warrior'} • Level {user?.level || 1}</div>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
              <span className="flex items-center gap-1 text-amber-400"><Flame className="w-3.5 h-3.5 fill-amber-400" /> {user?.streak || 0}d Streak</span>
              <span className="flex items-center gap-1 text-purple-300"><Zap className="w-3.5 h-3.5 fill-purple-400" /> {user?.xp || 0} XP</span>
            </div>
          </div>
        </div>

        {msg && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">College Name</label>
              <input
                type="text"
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Graduation Year</label>
              <input
                type="text"
                value={formData.graduationYear}
                onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Target Job Role</label>
            <input
              type="text"
              value={formData.targetRole}
              onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Profile Image URL</label>
            <input
              type="text"
              value={formData.profileImage}
              onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:border-purple-500"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Updating...' : 'Save Profile Changes'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
