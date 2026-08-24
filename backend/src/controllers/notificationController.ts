import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Notification from '../models/Notification';

export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    let notifications: any = await Notification.find({ userId: userId as any }).sort({ createdAt: -1 });

    if (notifications.length === 0 && userId) {
      notifications = await Notification.insertMany([
        {
          userId: userId as any,
          title: '🔥 Streak Alert',
          message: 'You are on a 12-day streak! Keep up the evening routine.',
          type: 'Streak',
          read: false
        },
        {
          userId: userId as any,
          title: '🎯 Target Recommendation',
          message: 'Time for Quantitative Aptitude practice: Percentages & Ratios.',
          type: 'Task',
          read: false
        },
        {
          userId: userId as any,
          title: '💼 Application Reminder',
          message: 'Google SDE-1 application deadline is approaching in 2 days.',
          type: 'Deadline',
          read: false
        }
      ] as any);
    }

    res.json({ success: true, notifications });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId: req.user?.id as any },
      { read: true },
      { new: true }
    );
    res.json({ success: true, notification });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
