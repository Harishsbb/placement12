import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Rocket, Mail, Lock, ArrowRight, Sparkles, Eye, EyeOff } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('student@placementquest.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090D16] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-purple-600 via-purple-500 to-pink-500 flex items-center justify-center shadow-xl shadow-purple-500/30">
            <Rocket className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Placement Quest</h1>
          <p className="text-xs text-purple-400 font-semibold uppercase tracking-wider mt-1">30 DAYS → GET PLACED 🚀</p>
        </div>

        {/* Login Card */}
        <div className="glass-card p-6 md:p-8 rounded-3xl border border-slate-800 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-100">Welcome back, Warrior! 👋</h2>
            <p className="text-xs text-slate-400 mt-1">Log in to track your evening placement schedule.</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">College / Student Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="name@college.edu"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-20 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-purple-300 hover:text-purple-200 border border-slate-700 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all"
                >
                  {showPassword ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-purple-400" />
                      <span>Hide</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 text-purple-400" />
                      <span>Show</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition-all mt-2"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Start Today\'s Quest'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials helper */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Need a test account? Click below to Register or use sample credentials!</span>
            </div>
            <p className="text-xs text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-purple-400 hover:text-purple-300 font-bold ml-1">
                Register Now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
