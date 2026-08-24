import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Task from '../models/Task';
import DSAProblem from '../models/DSAProblem';
import AptitudeRecord from '../models/AptitudeRecord';
import TechnicalTopic from '../models/TechnicalTopic';
import CommunicationSession from '../models/CommunicationSession';
import Interview from '../models/Interview';
import JobApplication from '../models/JobApplication';
import StudySession from '../models/StudySession';

export const getAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    // Daily & Weekly task completion trends
    const tasks = await Task.find({ userId });
    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    const pendingTasks = tasks.filter(t => t.status === 'Pending' || t.status === 'In Progress').length;
    const skippedTasks = tasks.filter(t => t.status === 'Skipped').length;

    // DSA metrics
    const dsaProblems = await DSAProblem.find({ userId, status: 'Solved' });
    const easyDsa = dsaProblems.filter(p => p.difficulty === 'Easy').length;
    const mediumDsa = dsaProblems.filter(p => p.difficulty === 'Medium').length;
    const hardDsa = dsaProblems.filter(p => p.difficulty === 'Hard').length;

    // Category progress scores (percentage estimation)
    const categoryProgress = [
      { category: 'DSA', progress: Math.min(100, Math.round((dsaProblems.length / 50) * 100)) },
      { category: 'Aptitude', progress: Math.min(100, Math.round(((await AptitudeRecord.countDocuments({ userId })) / 15) * 100)) },
      { category: 'Technical', progress: Math.min(100, Math.round(((await TechnicalTopic.countDocuments({ userId, status: 'Mastered' })) / 10) * 100)) },
      { category: 'Interview', progress: Math.min(100, Math.round(((await Interview.countDocuments({ userId })) / 5) * 100)) },
      { category: 'Communication', progress: Math.min(100, Math.round(((await CommunicationSession.countDocuments({ userId })) / 10) * 100)) }
    ];

    // Weekly study trend mock-up / historical aggregate
    const studySessions = await StudySession.find({ userId });
    const studyTrend = [
      { day: 'Mon', hours: 2.5 },
      { day: 'Tue', hours: 3.0 },
      { day: 'Wed', hours: 2.8 },
      { day: 'Thu', hours: 3.5 },
      { day: 'Fri', hours: 4.0 },
      { day: 'Sat', hours: 5.5 },
      { day: 'Sun', hours: 4.5 }
    ];

    // Placement Funnel
    const apps = await JobApplication.find({ userId });
    const placementFunnel = [
      { stage: 'Applied', count: apps.filter(a => a.status === 'Applied').length },
      { stage: 'Assessment', count: apps.filter(a => a.status === 'Assessment').length },
      { stage: 'Shortlisted', count: apps.filter(a => a.status === 'Shortlisted').length },
      { stage: 'Interview', count: apps.filter(a => a.status === 'Interview' || a.status === 'HR').length },
      { stage: 'Offer', count: apps.filter(a => a.status === 'Offer').length }
    ];

    res.json({
      success: true,
      analytics: {
        taskStats: {
          completed: completedTasks,
          pending: pendingTasks,
          skipped: skippedTasks
        },
        dsaStats: {
          easy: easyDsa,
          medium: mediumDsa,
          hard: hardDsa,
          total: dsaProblems.length
        },
        categoryProgress,
        studyTrend,
        placementFunnel
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
