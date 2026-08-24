import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { BarChart3, TrendingUp, PieChart, Activity } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics').then((res) => {
      if (res.data.success) {
        setAnalytics(res.data.analytics);
      }
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="py-20 text-center text-slate-400">Loading Placement Analytics...</div>;

  const categoryData = analytics?.categoryProgress || [
    { category: 'DSA', progress: 80 },
    { category: 'Aptitude', progress: 65 },
    { category: 'Technical', progress: 70 },
    { category: 'Interview', progress: 60 },
    { category: 'Communication', progress: 75 }
  ];

  const studyData = analytics?.studyTrend || [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 3.0 },
    { day: 'Wed', hours: 2.8 },
    { day: 'Thu', hours: 3.5 },
    { day: 'Fri', hours: 4.0 },
    { day: 'Sat', hours: 5.5 },
    { day: 'Sun', hours: 4.5 }
  ];

  const funnelData = analytics?.placementFunnel || [
    { stage: 'Applied', count: 18 },
    { stage: 'Assessment', count: 8 },
    { stage: 'Shortlisted', count: 6 },
    { stage: 'Interview', count: 4 },
    { stage: 'Offer', count: 1 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-purple-400" />
          <span>Placement Analytics & Mastery Dashboard</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Visualize your preparation growth, daily study hours, category mastery, and job conversion funnel.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Mastery Bar Chart */}
        <div className="glass-card p-5 rounded-3xl border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-emerald-400" />
            <span>Category Preparedness (%)</span>
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" />
                <XAxis dataKey="category" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Bar dataKey="progress" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Study Hours Line Chart */}
        <div className="glass-card p-5 rounded-3xl border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-pink-400" />
            <span>Weekly Study Hours Trend</span>
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={studyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Line type="monotone" dataKey="hours" stroke="#ec4899" strokeWidth={3} dot={{ fill: '#ec4899', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Placement Application Funnel */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span>Placement Conversion Funnel</span>
        </h3>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={funnelData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" />
              <XAxis type="number" stroke="#94a3b8" fontSize={11} />
              <YAxis dataKey="stage" type="category" stroke="#94a3b8" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
              <Bar dataKey="count" fill="#06b6d4" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
