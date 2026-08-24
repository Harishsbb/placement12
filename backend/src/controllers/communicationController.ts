import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import CommunicationSession from '../models/CommunicationSession';
import User from '../models/User';

export const getCommunicationSessions = async (req: AuthRequest, res: Response) => {
  try {
    const { type } = req.query;
    const filter: any = { userId: req.user?.id };
    if (type) filter.type = type;

    const sessions = await CommunicationSession.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, sessions });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCommunicationSession = async (req: AuthRequest, res: Response) => {
  try {
    const { type, duration, topic, confidence, notes, improvementPoints, date } = req.body;

    if (!type || !topic) {
      return res.status(400).json({ success: false, message: 'Type and Topic are required' });
    }

    const session = await CommunicationSession.create({
      userId: req.user?.id,
      type,
      duration: duration || 30,
      topic,
      confidence: confidence || 7,
      notes: notes || '',
      improvementPoints: improvementPoints || '',
      date: date || new Date().toISOString().split('T')[0]
    });

    // Award +20 XP for communication session
    const user = await User.findById(req.user?.id);
    if (user) {
      user.xp += 20;
      await user.save();
    }

    res.status(201).json({ success: true, session });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCommunicationSession = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const session = await CommunicationSession.findOneAndDelete({ _id: id, userId: req.user?.id });
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    res.json({ success: true, message: 'Session deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
