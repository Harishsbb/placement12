import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  CalendarCheck,
  CheckSquare,
  Code2,
  Calculator,
  Cpu,
  MessageSquare,
  Mic,
  Briefcase,
  FolderGit2,
  Calendar as CalendarIcon,
  Clock,
  BarChart3,
  Target,
  Trophy,
  User,
  Settings,
  Rocket,
  Flame,
  Award
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: "Today's Plan", path: '/today', icon: CalendarCheck, badge: 'Evening' },
    { label: 'Tasks', path: '/tasks', icon: CheckSquare },
    { label: 'DSA Tracker', path: '/dsa', icon: Code2, highlight: true },
    { label: 'Aptitude', path: '/aptitude', icon: Calculator },
    { label: 'Technical', path: '/technical', icon: Cpu },
    { label: 'Communication', path: '/communication', icon: MessageSquare },
    { label: 'Interview Practice', path: '/interviews', icon: Mic },
    { label: 'Applications', path: '/applications', icon: Briefcase },
    { label: 'Projects & Resume', path: '/projects', icon: FolderGit2 },
    { label: 'Calendar', path: '/calendar', icon: CalendarIcon },
    { label: 'Study Time', path: '/study-time', icon: Clock },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Goals', path: '/goals', icon: Target },
    { label: 'Achievements', path: '/achievements', icon: Trophy },
    { label: 'Profile', path: '/profile', icon: User },
    { label: 'Settings', path: '/settings', icon: Settings }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-[#0B0F19] border-r border-slate-800/80 flex flex-col transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800/80">
          <NavLink to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-transform">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-extrabold text-sm tracking-wide text-white flex items-center gap-1">
                Placement<span className="text-purple-400">Quest</span>
              </div>
              <div className="text-[10px] font-semibold tracking-wider text-emerald-400 uppercase">
                30 Days → Get Placed
              </div>
            </div>
          </NavLink>
        </div>

        {/* 30-Day Mission Widget */}
        <div className="p-4 mx-3 my-3 rounded-2xl bg-gradient-to-r from-purple-900/40 via-slate-900 to-slate-900 border border-purple-500/20">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <span className="text-purple-300 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              Day {user?.missionDay ?? 0} / 30
            </span>
            <span className="text-emerald-400">{Math.round(((user?.missionDay ?? 0) / 30) * 100)}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.round(((user?.missionDay ?? 0) / 30) * 100)}%` }}
            />
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive
                        ? 'text-purple-400'
                        : item.highlight
                        ? 'text-emerald-400'
                        : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Rank Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-[#090D16]">
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Award className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-slate-200 truncate">{user?.rankTitle || 'DSA Warrior'}</div>
              <div className="text-[10px] text-slate-400">Level {user?.level || 1} • {user?.xp || 0} XP</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
