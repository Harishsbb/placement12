import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import TechnicalTopic from '../models/TechnicalTopic';

export const getTechnicalTopics = async (req: AuthRequest, res: Response) => {
  try {
    const { category, status } = req.query;
    const filter: any = { userId: req.user?.id };
    if (category) filter.category = category;
    if (status) filter.status = status;

    const topics = await TechnicalTopic.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, topics });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createTechnicalTopic = async (req: AuthRequest, res: Response) => {
  try {
    const { category, topicName, subTopics, status, notes } = req.body;
    if (!category || !topicName) {
      return res.status(400).json({ success: false, message: 'Category and Topic Name are required' });
    }

    const topic = await TechnicalTopic.create({
      userId: req.user?.id,
      category,
      topicName,
      subTopics: subTopics || [],
      status: status || 'Learning',
      notes: notes || ''
    });

    res.status(201).json({ success: true, topic });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTechnicalTopic = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const topic = await TechnicalTopic.findOneAndUpdate(
      { _id: id, userId: req.user?.id },
      req.body,
      { new: true }
    );
    if (!topic) return res.status(404).json({ success: false, message: 'Topic not found' });
    res.json({ success: true, topic });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTechnicalTopic = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const topic = await TechnicalTopic.findOneAndDelete({ _id: id, userId: req.user?.id });
    if (!topic) return res.status(404).json({ success: false, message: 'Topic not found' });
    res.json({ success: true, message: 'Topic deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
