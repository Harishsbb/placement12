import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Interview from '../models/Interview';
import User from '../models/User';

export const getInterviews = async (req: AuthRequest, res: Response) => {
  try {
    const { type } = req.query;
    const filter: any = { userId: req.user?.id };
    if (type) filter.type = type;

    const interviews = await Interview.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, interviews });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createInterview = async (req: AuthRequest, res: Response) => {
  try {
    const { company, round, type, date, questions, feedback, mistakes, improvementAreas, scoring } = req.body;

    if (!company || !date) {
      return res.status(400).json({ success: false, message: 'Company and date are required' });
    }

    const defaultScore = {
      technicalKnowledge: 75,
      communication: 80,
      confidence: 70,
      problemSolving: 75,
      projectKnowledge: 85,
      overallScore: 77
    };

    const interview = await Interview.create({
      userId: req.user?.id,
      company,
      round: round || 'Round 1 Technical',
      type: type || 'Mock Interview',
      date,
      questions: questions || [],
      feedback: feedback || '',
      mistakes: mistakes || '',
      improvementAreas: improvementAreas || '',
      scoring: scoring || defaultScore
    });

    // Award +50 XP for completing/logging a Mock Interview
    const user = await User.findById(req.user?.id);
    if (user) {
      user.xp += 50;
      await user.save();
    }

    res.status(201).json({ success: true, interview });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateInterview = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const interview = await Interview.findOneAndUpdate(
      { _id: id, userId: req.user?.id },
      req.body,
      { new: true }
    );
    if (!interview) return res.status(404).json({ success: false, message: 'Interview record not found' });
    res.json({ success: true, interview });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteInterview = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const interview = await Interview.findOneAndDelete({ _id: id, userId: req.user?.id });
    if (!interview) return res.status(404).json({ success: false, message: 'Interview not found' });
    res.json({ success: true, message: 'Interview deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
