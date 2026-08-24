import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Task from '../models/Task';
import DSAProblem from '../models/DSAProblem';
import AptitudeRecord from '../models/AptitudeRecord';
import TechnicalTopic from '../models/TechnicalTopic';
import CommunicationSession from '../models/CommunicationSession';
import Interview from '../models/Interview';
import JobApplication from '../models/JobApplication';
import StudySession from '../models/StudySession';
import Goal from '../models/Goal';
import User from '../models/User';

export const seedSampleData = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const todayStr = new Date().toISOString().split('T')[0];

    // Seed Tasks
    await Task.deleteMany({ userId });
    await Task.insertMany([
      { userId, title: 'Solve 3 LeetCode Medium Problems (Two Pointers & Sliding Window)', category: 'DSA', priority: 'High', dueDate: todayStr, xp: 25, status: 'Completed', completedAt: new Date() },
      { userId, title: 'Revise Quantitative Aptitude: Percentages & Profit Loss', category: 'Aptitude', priority: 'Medium', dueDate: todayStr, xp: 20, status: 'Completed', completedAt: new Date() },
      { userId, title: 'Record 2-min Self-Introduction in English', category: 'Communication', priority: 'Medium', dueDate: todayStr, xp: 20, status: 'Pending' },
      { userId, title: 'Mock Interview Prep: System Design & Microservices Q&A', category: 'Interview', priority: 'High', dueDate: todayStr, xp: 50, status: 'Pending' },
      { userId, title: 'Watch 1 Episode of Anime (Controlled Reward Time)', category: 'Relaxation', priority: 'Low', dueDate: todayStr, xp: 10, status: 'Completed', completedAt: new Date() },
      { userId, title: 'Apply to SDE-1 position at Amazon & Atlassian', category: 'Application', priority: 'High', dueDate: todayStr, xp: 20, status: 'Pending' }
    ]);

    // Seed DSA Problems
    await DSAProblem.deleteMany({ userId });
    await DSAProblem.insertMany([
      { userId, problemName: '3Sum', platform: 'LeetCode', difficulty: 'Medium', topic: 'Two Pointer', status: 'Solved', solvedDate: todayStr, timeTaken: 25, solutionLink: 'https://leetcode.com/problems/3sum/', notes: 'Used sorted array with left/right pointers.' },
      { userId, problemName: 'Trapping Rain Water', platform: 'LeetCode', difficulty: 'Hard', topic: 'Arrays', status: 'Solved', solvedDate: todayStr, timeTaken: 40, solutionLink: 'https://leetcode.com/problems/trapping-rain-water/', notes: 'Two pointer approach optimizes space to O(1).' },
      { userId, problemName: 'Longest Substring Without Repeating Characters', platform: 'LeetCode', difficulty: 'Medium', topic: 'Sliding Window', status: 'Solved', solvedDate: todayStr, timeTaken: 20, solutionLink: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', notes: 'Maintained hash set of seen chars.' },
      { userId, problemName: 'Binary Tree Zigzag Level Order Traversal', platform: 'LeetCode', difficulty: 'Medium', topic: 'Trees', status: 'Solved', solvedDate: todayStr, timeTaken: 30, notes: 'BFS using deque.' },
      { userId, problemName: 'Number of Islands', platform: 'LeetCode', difficulty: 'Medium', topic: 'Graphs', status: 'Solved', solvedDate: todayStr, timeTaken: 20, notes: 'DFS grid traversal.' }
    ]);

    // Seed Aptitude
    await AptitudeRecord.deleteMany({ userId });
    await AptitudeRecord.insertMany([
      { userId, section: 'Quantitative', topic: 'Percentages & Profit Loss', questionsAttempted: 20, correct: 17, incorrect: 3, accuracy: 85, timeTaken: 25, date: todayStr },
      { userId, section: 'Logical Reasoning', topic: 'Blood Relations & Directions', questionsAttempted: 15, correct: 14, incorrect: 1, accuracy: 93, timeTaken: 20, date: todayStr },
      { userId, section: 'Verbal Ability', topic: 'Reading Comprehension & Vocabulary', questionsAttempted: 20, correct: 18, incorrect: 2, accuracy: 90, timeTaken: 20, date: todayStr }
    ]);

    // Seed Technical
    await TechnicalTopic.deleteMany({ userId });
    await TechnicalTopic.insertMany([
      { userId, category: 'Programming', topicName: 'Java Memory Management & Garbage Collection', status: 'Mastered', notes: 'Heap vs Stack, Young vs Old generation.' },
      { userId, category: 'DSA', topicName: 'Dynamic Programming Patterns & Knapsack', status: 'Learning', notes: 'Working on 2D DP grid subproblems.' },
      { userId, category: 'Database', topicName: 'SQL Indexing, B-Trees & Query Optimization', status: 'Revised', notes: 'Clustered vs Non-clustered indexes.' },
      { userId, category: 'Core CS', topicName: 'Operating System Process Synchronization & Deadlocks', status: 'Mastered', notes: 'Bankers Algorithm, Semaphores, Mutex locks.' }
    ]);

    // Seed Applications
    await JobApplication.deleteMany({ userId });
    await JobApplication.insertMany([
      { userId, company: 'Google', jobRole: 'Software Engineer - University Graduate', location: 'Bengaluru / Hyderabad', appliedDate: todayStr, salary: '32 LPA', status: 'Shortlisted', notes: 'Online assessment cleared. Interview scheduled!' },
      { userId, company: 'Microsoft', jobRole: 'Software Development Engineer', location: 'Hyderabad', appliedDate: todayStr, salary: '28 LPA', status: 'Assessment', notes: 'Coding assessment pending on Codility.' },
      { userId, company: 'Amazon', jobRole: 'SDE-1', location: 'Bengaluru', appliedDate: todayStr, salary: '29.5 LPA', status: 'Interview', notes: 'Round 1 completed. Awaiting bar raiser round.' },
      { userId, company: 'Atlassian', jobRole: 'Software Engineer 1', location: 'Bengaluru', appliedDate: todayStr, salary: '36 LPA', status: 'Applied', notes: 'Applied via employee referral.' },
      { userId, company: 'Uber', jobRole: 'Backend Engineer', location: 'Bengaluru', appliedDate: todayStr, salary: '38 LPA', status: 'Wishlist', notes: 'Preparing DSA & Low Level System Design.' }
    ]);

    // Seed Goals
    await Goal.deleteMany({ userId });
    await Goal.insertMany([
      { userId, title: 'Solve 100 LeetCode Medium/Hard Problems', target: 100, currentProgress: 42, unit: 'problems', category: 'DSA', deadline: '2026-09-30', status: 'In Progress' },
      { userId, title: 'Submit 30 Job Applications', target: 30, currentProgress: 18, unit: 'applications', category: 'Applications', deadline: '2026-09-30', status: 'In Progress' },
      { userId, title: 'Complete 5 Full Mock Technical Interviews', target: 5, currentProgress: 3, unit: 'interviews', category: 'Interviews', deadline: '2026-09-30', status: 'In Progress' }
    ]);

    // Update user stats
    await User.findByIdAndUpdate(userId, {
      xp: 2450,
      level: 8,
      rankTitle: 'DSA Warrior',
      streak: 12,
      bestStreak: 21,
      missionDay: 12
    });

    res.json({ success: true, message: 'Sample placement data seeded successfully!' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resetToDayZero = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    await Task.deleteMany({ userId });
    await DSAProblem.deleteMany({ userId });
    await AptitudeRecord.deleteMany({ userId });
    await TechnicalTopic.deleteMany({ userId });
    await CommunicationSession.deleteMany({ userId });
    await Interview.deleteMany({ userId });
    await JobApplication.deleteMany({ userId });
    await StudySession.deleteMany({ userId });
    await Goal.deleteMany({ userId });

    const user = await User.findByIdAndUpdate(
      userId,
      {
        xp: 0,
        level: 1,
        rankTitle: 'Beginner',
        streak: 0,
        bestStreak: 0,
        missionDay: 0,
        isMissionCompleted: false
      },
      { new: true }
    );

    res.json({ success: true, message: 'Reset to Day 0 successfully!', user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

