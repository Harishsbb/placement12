import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import User from '../models/User';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';

export const register = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, password, college, degree, graduationYear, targetRole, targetCompanies } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      college: college || 'Engineering College',
      degree: degree || 'B.Tech CS',
      graduationYear: graduationYear || '2026',
      targetRole: targetRole || 'Software Development Engineer',
      targetCompanies: targetCompanies || ['Google', 'Microsoft', 'Amazon', 'Atlassian'],
      xp: 250,
      level: 1,
      rankTitle: 'Beginner',
      streak: 1,
      bestStreak: 1,
      missionDay: 1
    });

    const token = generateToken((user._id as any).toString());

    res.status(201).json({
      success: true,
      token,
      user
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const login = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    let user = await User.findOne({ email: email.toLowerCase() });

    // Auto-create demo student user if logging in with default demo account for the first time
    if (!user && email.toLowerCase() === 'student@placementquest.com') {
      const hashedPassword = await hashPassword('password123');
      user = await User.create({
        name: 'Placement Warrior',
        email: 'student@placementquest.com',
        password: hashedPassword,
        college: 'PSNA College of Engineering',
        degree: 'B.Tech CS',
        graduationYear: '2027',
        targetRole: 'Software Engineer (SDE-1)',
        targetCompanies: ['Google', 'Microsoft', 'Amazon', 'Atlassian'],
        xp: 450,
        level: 2,
        rankTitle: 'DSA Explorer',
        streak: 5,
        bestStreak: 5,
        missionDay: 12
      });
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password. You can click Register to create a new account!' });
    }

    const isMatch = await comparePassword(password, user.password || '');
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Update streak logic
    const today = new Date();
    const lastActive = new Date(user.lastActiveDate);
    const diffTime = Math.abs(today.getTime() - lastActive.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      user.streak += 1;
      if (user.streak > user.bestStreak) {
        user.bestStreak = user.streak;
      }
    } else if (diffDays > 1) {
      user.streak = 1;
    }
    user.lastActiveDate = today;
    await user.save();

    const token = generateToken((user._id as any).toString());

    res.json({
      success: true,
      token,
      user
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, college, degree, graduationYear, targetRole, targetCompanies, profileImage, missionDay, isMissionCompleted } = req.body;
    
    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (college) user.college = college;
    if (degree) user.degree = degree;
    if (graduationYear) user.graduationYear = graduationYear;
    if (targetRole) user.targetRole = targetRole;
    if (targetCompanies) user.targetCompanies = targetCompanies;
    if (profileImage) user.profileImage = profileImage;
    if (missionDay !== undefined) user.missionDay = missionDay;
    if (isMissionCompleted !== undefined) user.isMissionCompleted = isMissionCompleted;

    await user.save();
    res.json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};
