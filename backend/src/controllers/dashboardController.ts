import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import User from '../models/User';
import Task from '../models/Task';
import DSAProblem from '../models/DSAProblem';
import JobApplication from '../models/JobApplication';
import StudySession from '../models/StudySession';
import Achievement from '../models/Achievement';

export const getDashboardData = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Level XP calculation (e.g. Level 1 requires 300 XP per level)
    const currentLevel = Math.floor(user.xp / 300) + 1;
    const nextLevelXp = currentLevel * 300 - user.xp;

    // Task metrics
    const totalTasks = await Task.countDocuments({ userId });
    const completedTasks = await Task.countDocuments({ userId, status: 'Completed' });
    const pendingTasks = await Task.find({ userId, status: { $ne: 'Completed' } }).limit(5);

    // DSA stats
    const dsaSolved = await DSAProblem.countDocuments({ userId, status: 'Solved' });
    const dsaEasy = await DSAProblem.countDocuments({ userId, difficulty: 'Easy', status: 'Solved' });
    const dsaMedium = await DSAProblem.countDocuments({ userId, difficulty: 'Medium', status: 'Solved' });
    const dsaHard = await DSAProblem.countDocuments({ userId, difficulty: 'Hard', status: 'Solved' });

    // Study time metrics
    const studySessions = await StudySession.find({ userId });
    const totalStudyMinutes = studySessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
    const studyHours = Math.floor(totalStudyMinutes / 60);
    const studyMins = totalStudyMinutes % 60;

    // Applications funnel
    const applications = await JobApplication.find({ userId });
    const applicationFunnel = {
      applied: applications.filter(a => a.status === 'Applied').length,
      assessment: applications.filter(a => a.status === 'Assessment').length,
      shortlisted: applications.filter(a => a.status === 'Shortlisted').length,
      interview: applications.filter(a => a.status === 'Interview' || a.status === 'HR').length,
      offer: applications.filter(a => a.status === 'Offer').length
    };

    // Unlocked achievements
    const achievementsCount = await Achievement.countDocuments({ userId, isUnlocked: true });

    // 30-Day mission percentage
    const missionProgressPct = Math.round((user.missionDay / 30) * 100);

    res.json({
      success: true,
      data: {
        user: {
          ...user.toJSON(),
          level: currentLevel,
          nextLevelXp
        },
        stats: {
          streak: user.streak,
          bestStreak: user.bestStreak,
          xp: user.xp,
          level: currentLevel,
          completedTasks,
          totalTasks,
          focusTimeFormatted: `${studyHours}h ${studyMins}m`,
          missionDay: user.missionDay,
          missionProgressPct
        },
        dsa: {
          totalSolved: dsaSolved,
          easy: dsaEasy,
          medium: dsaMedium,
          hard: dsaHard
        },
        applications: applicationFunnel,
        pendingTasks,
        achievementsUnlocked: achievementsCount
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};
