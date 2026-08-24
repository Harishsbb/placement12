import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import JobApplication from '../models/JobApplication';
import User from '../models/User';

export const getApplications = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.query;
    const filter: any = { userId: req.user?.id };
    if (status) filter.status = status;

    const applications = await JobApplication.find(filter).sort({ createdAt: -1 });

    const funnel = {
      applied: await JobApplication.countDocuments({ userId: req.user?.id, status: 'Applied' }),
      assessment: await JobApplication.countDocuments({ userId: req.user?.id, status: 'Assessment' }),
      shortlisted: await JobApplication.countDocuments({ userId: req.user?.id, status: 'Shortlisted' }),
      interview: await JobApplication.countDocuments({ userId: req.user?.id, status: { $in: ['Interview', 'HR'] } }),
      offer: await JobApplication.countDocuments({ userId: req.user?.id, status: 'Offer' }),
      rejected: await JobApplication.countDocuments({ userId: req.user?.id, status: 'Rejected' })
    };

    res.json({ success: true, applications, funnel });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createApplication = async (req: AuthRequest, res: Response) => {
  try {
    const { company, jobRole, location, applicationLink, appliedDate, deadline, salary, status, interviewDate, notes } = req.body;

    if (!company || !jobRole) {
      return res.status(400).json({ success: false, message: 'Company and Job Role are required' });
    }

    const application = await JobApplication.create({
      userId: req.user?.id,
      company,
      jobRole,
      location: location || 'Remote / Hybrid',
      applicationLink: applicationLink || '',
      appliedDate: appliedDate || new Date().toISOString().split('T')[0],
      deadline: deadline || '',
      salary: salary || '12 - 18 LPA',
      status: status || 'Applied',
      interviewDate: interviewDate || '',
      notes: notes || ''
    });

    // Award +20 XP for filing a Job Application
    const user = await User.findById(req.user?.id);
    if (user) {
      user.xp += 20;
      await user.save();
    }

    res.status(201).json({ success: true, application });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateApplication = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const application = await JobApplication.findOneAndUpdate(
      { _id: id, userId: req.user?.id },
      req.body,
      { new: true }
    );
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
    res.json({ success: true, application });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteApplication = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const application = await JobApplication.findOneAndDelete({ _id: id, userId: req.user?.id });
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
    res.json({ success: true, message: 'Application deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
