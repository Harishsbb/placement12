import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import DailyPlan from '../models/DailyPlan';

const defaultSchedule = [
  { timeRange: '8:00 AM – 5:30 PM', activity: 'College Classes & Academic Routine', category: 'College', isCompleted: false },
  { timeRange: '6:15 PM – 7:45 PM', activity: 'Technical Prep & LeetCode / DSA Practice', category: 'Technical', isCompleted: false },
  { timeRange: '7:45 PM – 8:15 PM', activity: 'Dinner & Mindful Evening Break', category: 'Break', isCompleted: false },
  { timeRange: '8:15 PM – 9:00 PM', activity: 'Quantitative & Logical Aptitude Practice', category: 'Aptitude', isCompleted: false },
  { timeRange: '9:00 PM – 9:30 PM', activity: 'Communication, Self Intro & Vocabulary', category: 'Communication', isCompleted: false },
  { timeRange: '9:30 PM – 10:15 PM', activity: 'Interview Prep & Technical / HR Q&A', category: 'Interview', isCompleted: false },
  { timeRange: '10:15 PM – 11:00 PM', activity: 'Anime / Controlled Reward Relaxation Time', category: 'Relaxation', isCompleted: false },
  { timeRange: '11:00 PM', activity: 'Daily Revision & Sleep Preparation', category: 'Revision', isCompleted: false }
];

export const getDailyPlan = async (req: AuthRequest, res: Response) => {
  try {
    const date = (req.query.date as string) || new Date().toISOString().split('T')[0];
    let plan = await DailyPlan.findOne({ userId: req.user?.id, date });

    if (!plan) {
      plan = await DailyPlan.create({
        userId: req.user?.id,
        date,
        slots: defaultSchedule
      });
    }

    res.json({ success: true, plan });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateDailyPlan = async (req: AuthRequest, res: Response) => {
  try {
    const { date, slots } = req.body;
    const planDate = date || new Date().toISOString().split('T')[0];

    let plan = await DailyPlan.findOne({ userId: req.user?.id, date: planDate });
    if (plan) {
      plan.slots = slots;
      await plan.save();
    } else {
      plan = await DailyPlan.create({
        userId: req.user?.id,
        date: planDate,
        slots
      });
    }

    res.json({ success: true, plan });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
