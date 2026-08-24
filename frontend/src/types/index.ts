export interface User {
  _id: string;
  name: string;
  email: string;
  college: string;
  degree: string;
  graduationYear: string;
  targetRole: string;
  targetCompanies: string[];
  profileImage: string;
  xp: number;
  level: number;
  rankTitle: string;
  streak: number;
  bestStreak: number;
  missionDay: number;
  isMissionCompleted: boolean;
  createdAt?: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  category: 'Technical' | 'DSA' | 'Aptitude' | 'Communication' | 'Interview' | 'Project' | 'Resume' | 'Application' | 'Relaxation' | 'Other';
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
  startTime?: string;
  endTime?: string;
  estimatedDuration?: number;
  xp: number;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Skipped';
  notes?: string;
  isRecurring?: boolean;
  recurrencePattern?: 'Daily' | 'Weekdays' | 'Weekly' | 'Custom';
  completedAt?: string;
}

export interface ScheduleSlot {
  _id?: string;
  timeRange: string;
  activity: string;
  category: string;
  isCompleted: boolean;
  notes?: string;
}

export interface DailyPlan {
  _id: string;
  date: string;
  slots: ScheduleSlot[];
}

export interface DSAProblem {
  _id: string;
  problemName: string;
  platform: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  status: 'Solved' | 'Attempted' | 'Bookmarked';
  solvedDate: string;
  timeTaken: number;
  solutionLink?: string;
  notes?: string;
}

export interface AptitudeRecord {
  _id: string;
  section: 'Quantitative' | 'Logical Reasoning' | 'Verbal Ability';
  topic: string;
  questionsAttempted: number;
  correct: number;
  incorrect: number;
  accuracy: number;
  timeTaken: number;
  date: string;
}

export interface TechnicalTopic {
  _id: string;
  category: 'Programming' | 'DSA' | 'Database' | 'Web Development' | 'Core CS';
  topicName: string;
  subTopics?: string[];
  status: 'Not Started' | 'Learning' | 'Revised' | 'Mastered';
  notes?: string;
}

export interface CommunicationSession {
  _id: string;
  type: 'Speaking Practice' | 'Listening Practice' | 'Vocabulary' | 'Grammar' | 'Self Introduction' | 'Group Discussion' | 'Presentation' | 'English Conversation';
  duration: number;
  topic: string;
  confidence: number;
  notes?: string;
  improvementPoints?: string;
  date: string;
}

export interface QuestionAnswer {
  question: string;
  answer?: string;
  confidence?: number;
}

export interface InterviewScore {
  technicalKnowledge: number;
  communication: number;
  confidence: number;
  problemSolving: number;
  projectKnowledge: number;
  overallScore: number;
}

export interface Interview {
  _id: string;
  company: string;
  round: string;
  type: 'Technical' | 'HR' | 'Managerial' | 'Coding' | 'Group Discussion' | 'Mock Interview';
  date: string;
  questions: QuestionAnswer[];
  feedback?: string;
  mistakes?: string;
  improvementAreas?: string;
  scoring: InterviewScore;
}

export interface ProjectPrepQnA {
  question: string;
  answer: string;
}

export interface Project {
  _id: string;
  name: string;
  technology: string[];
  description: string;
  githubLink?: string;
  liveLink?: string;
  keyFeatures: string[];
  challenges?: string;
  solutions?: string;
  interviewQuestions: ProjectPrepQnA[];
}

export interface Resume {
  _id: string;
  version: string;
  lastUpdated: string;
  atsScore: number;
  projects: string[];
  skills: string[];
  achievements: string[];
  certifications: string[];
}

export interface JobApplication {
  _id: string;
  company: string;
  jobRole: string;
  location?: string;
  applicationLink?: string;
  appliedDate: string;
  deadline?: string;
  salary?: string;
  status: 'Wishlist' | 'Applied' | 'Assessment' | 'Shortlisted' | 'Interview' | 'HR' | 'Offer' | 'Rejected' | 'Withdrawn';
  interviewDate?: string;
  notes?: string;
}

export interface StudySession {
  _id: string;
  subject: string;
  category: 'Technical / DSA' | 'Aptitude' | 'Communication' | 'Interview' | 'Other';
  startTime: string;
  endTime: string;
  durationMinutes: number;
  notes?: string;
  date: string;
}

export interface Goal {
  _id: string;
  title: string;
  target: number;
  currentProgress: number;
  unit: string;
  category: string;
  deadline: string;
  status: 'In Progress' | 'Completed' | 'Failed';
}

export interface Achievement {
  _id: string;
  code: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  unlockedAt?: string;
  isUnlocked: boolean;
}

export interface AppNotification {
  _id: string;
  title: string;
  message: string;
  type: 'Task' | 'Interview' | 'Deadline' | 'Streak' | 'Goal' | 'System';
  read: boolean;
  createdAt?: string;
}
