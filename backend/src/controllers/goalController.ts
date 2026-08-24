import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Goal from '../models/Goal';

export const getGoals = async (req: AuthRequest, res: Response) => {
  try {
    const goals = await Goal.find({ userId: req.user?.id }).sort({ createdAt: -1 });
    res.json({ success: true, goals });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createGoal = async (req: AuthRequest, res: Response) => {
  try {
    const { title, target, currentProgress, unit, category, deadline } = req.body;
    if (!title || target === undefined || !deadline) {
      return res.status(400).json({ success: false, message: 'Title, target, and deadline are required' });
    }

    const goal = await Goal.create({
      userId: req.user?.id,
      title,
      target,
      currentProgress: currentProgress || 0,
      unit: unit || 'problems',
      category: category || 'DSA',
      deadline,
      status: 'In Progress'
    });

    res.status(201).json({ success: true, goal });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateGoal = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const goal = await Goal.findOne({ _id: id, userId: req.user?.id });
    if (!goal) return res.status(404).json({ success: false, message: 'Goal not found' });

    Object.assign(goal, req.body);
    if (goal.currentProgress >= goal.target) {
      goal.status = 'Completed';
    }

    await goal.save();
    res.json({ success: true, goal });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteGoal = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const goal = await Goal.findOneAndDelete({ _id: id, userId: req.user?.id });
    if (!goal) return res.status(404).json({ success: false, message: 'Goal not found' });
    res.json({ success: true, message: 'Goal deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
