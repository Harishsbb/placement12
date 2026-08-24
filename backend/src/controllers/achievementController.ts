import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Achievement from '../models/Achievement';

const defaultAchievementsList = [
  { code: 'STREAK_7', title: '7 Day Streak', description: 'Stayed consistent for 7 days in a row', category: 'Streak', icon: '🔥' },
  { code: 'STREAK_15', title: '15 Day Streak', description: 'Halfway through the 30 day mission!', category: 'Streak', icon: '⚡' },
  { code: 'STREAK_30', title: '30 Day Warrior', description: 'Completed the 30-Day Placement Quest', category: 'Streak', icon: '🏆' },
  { code: 'DSA_FIRST', title: 'First Problem Solved', description: 'Solved your first DSA problem', category: 'DSA', icon: '💻' },
  { code: 'DSA_50', title: '50 DSA Problems', description: 'Conquered 50 DSA problems on LeetCode/GFG', category: 'DSA', icon: '⚔️' },
  { code: 'DSA_100', title: 'DSA Legend', description: 'Solved 100+ DSA problems', category: 'DSA', icon: '🚀' },
  { code: 'INTERVIEW_FIRST', title: 'First Interview', description: 'Logged your first interview or mock session', category: 'Interview', icon: '🎤' },
  { code: 'INTERVIEW_5', title: 'Mock Master', description: 'Completed 5 mock interview sessions', category: 'Interview', icon: '🎯' },
  { code: 'APP_FIRST', title: 'First Job Application', description: 'Sent your first job application', category: 'Applications', icon: '💼' },
  { code: 'APP_25', title: 'Application Spree', description: 'Applied to 25+ target companies', category: 'Applications', icon: '📨' },
  { code: 'OFFER_FIRST', title: 'First Offer', description: 'Received a job offer letter!', category: 'Placement', icon: '🎉' },
  { code: 'PLACEMENT_ACHIEVED', title: 'Placement Achieved', description: 'Officially secured placement!', category: 'Placement', icon: '👑' }
];

export const getAchievements = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    let userAchievements: any = await Achievement.find({ userId: userId as any });

    if (userAchievements.length === 0 && userId) {
      const recordsToInsert = defaultAchievementsList.map((ach, idx) => ({
        userId: userId as any,
        ...ach,
        isUnlocked: idx === 0
      }));
      userAchievements = await Achievement.insertMany(recordsToInsert as any);
    }

    res.json({ success: true, achievements: userAchievements });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
