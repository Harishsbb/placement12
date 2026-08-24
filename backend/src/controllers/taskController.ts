import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Task from '../models/Task';
import User from '../models/User';
import Achievement from '../models/Achievement';

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const { category, status, date } = req.query;
    const filter: any = { userId: req.user?.id };

    if (category) filter.category = category;
    if (status) filter.status = status;
    if (date) filter.dueDate = date;

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, tasks });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, category, priority, dueDate, startTime, endTime, estimatedDuration, xp, notes, isRecurring, recurrencePattern } = req.body;

    if (!title || !dueDate) {
      return res.status(400).json({ success: false, message: 'Title and due date are required' });
    }

    const task = await Task.create({
      userId: req.user?.id,
      title,
      description,
      category: category || 'Technical',
      priority: priority || 'Medium',
      dueDate,
      startTime,
      endTime,
      estimatedDuration,
      xp: xp || 25,
      notes,
      isRecurring: isRecurring || false,
      recurrencePattern: recurrencePattern || 'Daily'
    });

    res.status(201).json({ success: true, task });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const task = await Task.findOne({ _id: id, userId: req.user?.id });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    Object.assign(task, req.body);
    await task.save();

    res.json({ success: true, task });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ _id: id, userId: req.user?.id });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const completeTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const task = await Task.findOne({ _id: id, userId: req.user?.id });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    let xpGained = 0;
    if (task.status !== 'Completed') {
      task.status = 'Completed';
      task.completedAt = new Date();
      await task.save();

      // Award XP to user safely (no duplicates)
      const user = await User.findById(req.user?.id);
      if (user) {
        xpGained = task.xp || 25;
        user.xp += xpGained;
        
        // Calculate Level
        const newLevel = Math.floor(user.xp / 300) + 1;
        if (newLevel > user.level) {
          user.level = newLevel;
          if (newLevel >= 5) user.rankTitle = 'DSA Warrior';
          if (newLevel >= 10) user.rankTitle = 'Interview Ready';
          if (newLevel >= 20) user.rankTitle = 'Placement Hunter';
          if (newLevel >= 30) user.rankTitle = 'Job Ready';
        }

        await user.save();

        // Check task achievements
        const completedCount = await Task.countDocuments({ userId: req.user?.id, status: 'Completed' });
        if (completedCount >= 10) {
          await Achievement.findOneAndUpdate(
            { userId: req.user?.id, code: 'TASKS_10' },
            { isUnlocked: true, unlockedAt: new Date() },
            { upsert: true }
          );
        }
      }
    }

    const updatedUser = await User.findById(req.user?.id);

    res.json({
      success: true,
      task,
      xpGained,
      user: updatedUser
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
