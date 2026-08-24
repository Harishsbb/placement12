import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Bell, Flame, Zap, Database, User as UserIcon, LogOut, X, CheckCircle2, RotateCcw } from 'lucide-react';
import api from '../services/api';
import { AppNotification } from '../types';

export const Header: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
  const { user, logout, seedDemoData, resetToDayZero } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    if (user) {
      api.get('/notifications').then(res => {
        if (res.data.success) {
          setNotifications(res.data.notifications);
        }
      }).catch(err => console.error(err));
    }
  }, [user]);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await seedDemoData();
    } catch (e) {
      console.error(e);
    } finally {
      setSeeding(false);
    }
  };

  const handleResetDayZero = async () => {
    setSeeding(true);
    try {
      await resetToDayZero();
    } catch (e) {
      console.error(e);
    } finally {
      setSeeding(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#090D16]/80 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-6 flex items-center justify-between">
      {/* Search & Mobile menu toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800/50"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="relative hidden sm:block w-64 md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search DSA, Aptitude, Applications..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
      </div>

      {/* Stats & Actions */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Reset to Day 0 */}
        <button
          onClick={handleResetDayZero}
          disabled={seeding}
          title="Start challenge from Day 0"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-rose-900/30 border border-rose-500/30 hover:border-rose-500 text-rose-300 rounded-xl text-xs font-medium transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Start Day 0</span>
        </button>

        {/* Quick Seed Demo Data */}
        <button
          onClick={handleSeed}
          disabled={seeding}
          title="Seed sample placement data"
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-purple-900/30 border border-purple-500/30 hover:border-purple-500 text-purple-300 rounded-xl text-xs font-medium transition-all"
        >
          <Database className="w-3.5 h-3.5" />
          <span>{seeding ? 'Seeding...' : 'Demo Data'}</span>
        </button>

        {/* Streak Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full text-xs font-semibold">
          <Flame className="w-3.5 h-3.5 fill-amber-400" />
          <span>{user?.streak || 0}d</span>
        </div>

        {/* XP Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded-full text-xs font-semibold">
          <Zap className="w-3.5 h-3.5 fill-purple-400 text-purple-400" />
          <span>{user?.xp || 0} XP</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/60 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full animate-ping" />
            )}
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Notifications</h4>
                <button onClick={() => setShowNotifications(false)} className="text-slate-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">No notifications</p>
                ) : (
                  notifications.map(n => (
                    <div key={n._id} className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800 text-xs">
                      <div className="font-semibold text-slate-200 mb-0.5">{n.title}</div>
                      <div className="text-slate-400 text-[11px]">{n.message}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1 rounded-full border border-slate-800 hover:border-purple-500/50 transition-colors"
          >
            <img
              src={user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={user?.name}
              className="w-8 h-8 rounded-full object-cover border border-purple-500/40"
            />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50">
              <div className="p-3 border-b border-slate-800 mb-1">
                <div className="font-bold text-sm text-slate-100">{user?.name}</div>
                <div className="text-xs text-purple-400 font-medium">{user?.rankTitle || 'DSA Warrior'} • Lvl {user?.level || 1}</div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">{user?.email}</div>
              </div>
              <a
                href="/profile"
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 rounded-xl transition-colors"
              >
                <UserIcon className="w-4 h-4 text-slate-400" />
                <span>My Profile</span>
              </a>
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-950/30 rounded-xl transition-colors mt-1"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
