import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FolderGit2, FileText, Plus, ExternalLink, Sparkles, X } from 'lucide-react';
import { Project, Resume } from '../types';

export const ProjectsResumePage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/projects'), api.get('/resume')])
      .then(([projRes, resRes]) => {
        if (projRes.data.success) setProjects(projRes.data.projects);
        if (resRes.data.success) setResume(resRes.data.resume);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="py-20 text-center text-slate-400">Loading Projects & Resume prep...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
          <FolderGit2 className="w-6 h-6 text-purple-400" />
          <span>Projects & Resume Preparation</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Prepare project explanation Q&A ("Explain your project", "Why React/Node?", "Scalability") and track ATS score.
        </p>
      </div>

      {/* Resume Overview Widget */}
      <div className="glass-card p-5 rounded-3xl border border-purple-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Current Resume {resume?.version}</h3>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ATS Score: {resume?.atsScore}%
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Last updated: {resume?.lastUpdated}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {resume?.skills?.slice(0, 6).map((sk, idx) => (
            <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-300">
              {sk}
            </span>
          ))}
        </div>
      </div>

      {/* Projects List with Interview Q&A Section */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-200">Portfolio Projects & Interview Questions</h2>
        {projects.length === 0 ? (
          <div className="p-8 text-center text-slate-500 glass-card rounded-2xl">
            No projects added yet. Add projects to generate interview preparation questions.
          </div>
        ) : (
          projects.map((p) => (
            <div key={p._id} className="p-5 rounded-3xl glass-card border border-slate-800 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">{p.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{p.description}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {p.technology.map((tech, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px] font-bold">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sample Q&A for project */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Interview Practice Q&A for "{p.name}"</span>
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="font-bold text-purple-300">Q: "Explain your project architecture and technology stack."</span>
                    <p className="text-slate-400 mt-1">A: Built using {p.technology.join(', ')}. Key features include {p.keyFeatures?.join(', ') || 'real-time dashboard and modular APIs'}.</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="font-bold text-purple-300">Q: "What key challenge did you face and how did you resolve it?"</span>
                    <p className="text-slate-400 mt-1">A: {p.challenges || 'Optimized database query performance and state synchronization across components.'}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
