import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import StudySession from '../models/StudySession';

export const getStudySessions = async (req: AuthRequest, res: Response) => {
  try {
    const sessions = await StudySession.find({ userId: req.user?.id }).sort({ createdAt: -1 });

    const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);

    const categoryBreakdown = {
      'Technical / DSA': sessions.filter(s => s.category === 'Technical / DSA').reduce((sum, s) => sum + s.durationMinutes, 0),
      'Aptitude': sessions.filter(s => s.category === 'Aptitude').reduce((sum, s) => sum + s.durationMinutes, 0),
      'Communication': sessions.filter(s => s.category === 'Communication').reduce((sum, s) => sum + s.durationMinutes, 0),
      'Interview': sessions.filter(s => s.category === 'Interview').reduce((sum, s) => sum + s.durationMinutes, 0),
      'Other': sessions.filter(s => s.category === 'Other').reduce((sum, s) => sum + s.durationMinutes, 0)
    };

    res.json({
      success: true,
      sessions,
      totalMinutes,
      categoryBreakdown
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createStudySession = async (req: AuthRequest, res: Response) => {
  try {
    const { subject, category, startTime, endTime, durationMinutes, notes, date } = req.body;
    if (!subject || durationMinutes === undefined) {
      return res.status(400).json({ success: false, message: 'Subject and duration are required' });
    }

    const session = await StudySession.create({
      userId: req.user?.id,
      subject,
      category: category || 'Technical / DSA',
      startTime: startTime || '18:00',
      endTime: endTime || '19:30',
      durationMinutes,
      notes: notes || '',
      date: date || new Date().toISOString().split('T')[0]
    });

    res.status(201).json({ success: true, session });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteStudySession = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const session = await StudySession.findOneAndDelete({ _id: id, userId: req.user?.id });
    if (!session) return res.status(404).json({ success: false, message: 'Study session not found' });
    res.json({ success: true, message: 'Session deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
