import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { errorHandler } from './middleware/errorHandler';

// Route imports
import authRoutes from './routes/authRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import taskRoutes from './routes/taskRoutes';
import dailyPlanRoutes from './routes/dailyPlanRoutes';
import dsaRoutes from './routes/dsaRoutes';
import aptitudeRoutes from './routes/aptitudeRoutes';
import technicalRoutes from './routes/technicalRoutes';
import communicationRoutes from './routes/communicationRoutes';
import interviewRoutes from './routes/interviewRoutes';
import applicationRoutes from './routes/applicationRoutes';
import projectResumeRoutes from './routes/projectResumeRoutes';
import studyTimeRoutes from './routes/studyTimeRoutes';
import goalRoutes from './routes/goalRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import achievementRoutes from './routes/achievementRoutes';
import notificationRoutes from './routes/notificationRoutes';
import seedRoutes from './routes/seedRoutes';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

// Ensure DB is connected for serverless invocations
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Routes
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Placement Quest API is healthy and operational 🚀' });
});

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/daily-plan', dailyPlanRoutes);
app.use('/api/dsa', dsaRoutes);
app.use('/api/aptitude', aptitudeRoutes);
app.use('/api/technical', technicalRoutes);
app.use('/api/communication', communicationRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api', projectResumeRoutes);
app.use('/api/study-time', studyTimeRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/seed', seedRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
