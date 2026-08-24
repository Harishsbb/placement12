import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import AptitudeRecord from '../models/AptitudeRecord';
import User from '../models/User';

export const getAptitudeRecords = async (req: AuthRequest, res: Response) => {
  try {
    const { section } = req.query;
    const filter: any = { userId: req.user?.id };
    if (section) filter.section = section;

    const records = await AptitudeRecord.find(filter).sort({ createdAt: -1 });
    
    // Overall stats
    const totalAttempted = records.reduce((acc, r) => acc + r.questionsAttempted, 0);
    const totalCorrect = records.reduce((acc, r) => acc + r.correct, 0);
    const overallAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

    res.json({
      success: true,
      records,
      stats: {
        totalAttempted,
        totalCorrect,
        overallAccuracy
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createAptitudeRecord = async (req: AuthRequest, res: Response) => {
  try {
    const { section, topic, questionsAttempted, correct, incorrect, timeTaken, date } = req.body;

    if (!section || !topic || questionsAttempted === undefined || correct === undefined) {
      return res.status(400).json({ success: false, message: 'Missing required aptitude fields' });
    }

    const inc = incorrect !== undefined ? incorrect : Math.max(0, questionsAttempted - correct);
    const accuracy = questionsAttempted > 0 ? Math.round((correct / questionsAttempted) * 100) : 0;

    const record = await AptitudeRecord.create({
      userId: req.user?.id,
      section,
      topic,
      questionsAttempted,
      correct,
      incorrect: inc,
      accuracy,
      timeTaken: timeTaken || 20,
      date: date || new Date().toISOString().split('T')[0]
    });

    // Award +20 XP for practicing aptitude
    const user = await User.findById(req.user?.id);
    if (user) {
      user.xp += 20;
      await user.save();
    }

    res.status(201).json({ success: true, record });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAptitudeRecord = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const record = await AptitudeRecord.findOneAndDelete({ _id: id, userId: req.user?.id });
    if (!record) return res.status(404).json({ success: false, message: 'Aptitude record not found' });
    res.json({ success: true, message: 'Aptitude record deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
