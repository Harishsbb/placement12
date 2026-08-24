import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import DSAProblem from '../models/DSAProblem';
import User from '../models/User';

export const getDSAProblems = async (req: AuthRequest, res: Response) => {
  try {
    const { topic, difficulty, status } = req.query;
    const filter: any = { userId: req.user?.id };

    if (topic) filter.topic = topic;
    if (difficulty) filter.difficulty = difficulty;
    if (status) filter.status = status;

    const problems = await DSAProblem.find(filter).sort({ createdAt: -1 });

    const totalSolved = await DSAProblem.countDocuments({ userId: req.user?.id, status: 'Solved' });
    const easyCount = await DSAProblem.countDocuments({ userId: req.user?.id, difficulty: 'Easy', status: 'Solved' });
    const mediumCount = await DSAProblem.countDocuments({ userId: req.user?.id, difficulty: 'Medium', status: 'Solved' });
    const hardCount = await DSAProblem.countDocuments({ userId: req.user?.id, difficulty: 'Hard', status: 'Solved' });

    res.json({
      success: true,
      problems,
      stats: {
        totalSolved,
        easyCount,
        mediumCount,
        hardCount
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createDSAProblem = async (req: AuthRequest, res: Response) => {
  try {
    const { problemName, platform, difficulty, topic, status, solvedDate, timeTaken, solutionLink, notes } = req.body;

    if (!problemName || !topic) {
      return res.status(400).json({ success: false, message: 'Problem name and topic are required' });
    }

    const problem = await DSAProblem.create({
      userId: req.user?.id,
      problemName,
      platform: platform || 'LeetCode',
      difficulty: difficulty || 'Medium',
      topic: topic || 'Arrays',
      status: status || 'Solved',
      solvedDate: solvedDate || new Date().toISOString().split('T')[0],
      timeTaken: timeTaken || 30,
      solutionLink,
      notes
    });

    // Add XP for solving DSA problem (+25 XP)
    if (status === 'Solved') {
      const user = await User.findById(req.user?.id);
      if (user) {
        user.xp += 25;
        const newLevel = Math.floor(user.xp / 300) + 1;
        user.level = newLevel;
        await user.save();
      }
    }

    res.status(201).json({ success: true, problem });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateDSAProblem = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const problem = await DSAProblem.findOneAndUpdate(
      { _id: id, userId: req.user?.id },
      req.body,
      { new: true }
    );
    if (!problem) return res.status(404).json({ success: false, message: 'Problem not found' });
    res.json({ success: true, problem });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteDSAProblem = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const problem = await DSAProblem.findOneAndDelete({ _id: id, userId: req.user?.id });
    if (!problem) return res.status(404).json({ success: false, message: 'Problem not found' });
    res.json({ success: true, message: 'Problem deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
