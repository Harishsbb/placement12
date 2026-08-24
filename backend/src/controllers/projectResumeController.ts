import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Project from '../models/Project';
import Resume from '../models/Resume';

// Project Controllers
export const getProjects = async (req: AuthRequest, res: Response) => {
  try {
    const projects = await Project.find({ userId: req.user?.id }).sort({ createdAt: -1 });
    res.json({ success: true, projects });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const { name, technology, description, githubLink, liveLink, keyFeatures, challenges, solutions, interviewQuestions } = req.body;
    if (!name || !description) {
      return res.status(400).json({ success: false, message: 'Name and description are required' });
    }

    const project = await Project.create({
      userId: req.user?.id,
      name,
      technology: technology || ['React', 'Node.js', 'MongoDB'],
      description,
      githubLink: githubLink || '',
      liveLink: liveLink || '',
      keyFeatures: keyFeatures || [],
      challenges: challenges || '',
      solutions: solutions || '',
      interviewQuestions: interviewQuestions || []
    });

    res.status(201).json({ success: true, project });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const project = await Project.findOneAndUpdate(
      { _id: id, userId: req.user?.id },
      req.body,
      { new: true }
    );
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, project });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const project = await Project.findOneAndDelete({ _id: id, userId: req.user?.id });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, message: 'Project deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Resume Controllers
export const getResume = async (req: AuthRequest, res: Response) => {
  try {
    let resume = await Resume.findOne({ userId: req.user?.id });
    if (!resume) {
      resume = await Resume.create({
        userId: req.user?.id,
        version: 'v1.0',
        lastUpdated: new Date().toISOString().split('T')[0],
        atsScore: 85,
        projects: ['Placement Quest Platform', 'E-Commerce Microservices'],
        skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'MongoDB', 'SQL', 'DSA', 'Docker'],
        achievements: ['Rank 1 in College Hackathon', 'Solved 100+ LeetCode problems'],
        certifications: ['AWS Certified Cloud Practitioner', 'MongoDB Certified Developer']
      });
    }
    res.json({ success: true, resume });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateResume = async (req: AuthRequest, res: Response) => {
  try {
    const { version, atsScore, projects, skills, achievements, certifications } = req.body;
    let resume = await Resume.findOne({ userId: req.user?.id });
    if (resume) {
      if (version) resume.version = version;
      if (atsScore !== undefined) resume.atsScore = atsScore;
      if (projects) resume.projects = projects;
      if (skills) resume.skills = skills;
      if (achievements) resume.achievements = achievements;
      if (certifications) resume.certifications = certifications;
      resume.lastUpdated = new Date().toISOString().split('T')[0];
      await resume.save();
    } else {
      resume = await Resume.create({
        userId: req.user?.id,
        version: version || 'v1.0',
        lastUpdated: new Date().toISOString().split('T')[0],
        atsScore: atsScore || 85,
        projects: projects || [],
        skills: skills || [],
        achievements: achievements || [],
        certifications: certifications || []
      });
    }
    res.json({ success: true, resume });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
