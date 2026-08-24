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

// Fast health check endpoint (responds without requiring database connection)
app.get(['/api/health', '/health'], (req, res) => {
  res.json({ success: true, message: 'Placement Quest API is healthy and operational 🚀' });
});

// Safely ensure DB is connected before handling data routes
app.use((req, res, next) => {
  connectDB()
    .then(() => next())
    .catch((err) => {
      console.error('[Database Middleware Error]', err);
      res.status(500).json({
        success: false,
        message: err.message || 'Database connection error'
      });
    });
});

// Routes (supports both /api/path and /path for Vercel multi-service routing)
app.use(['/api/auth', '/auth'], authRoutes);
app.use(['/api/dashboard', '/dashboard'], dashboardRoutes);
app.use(['/api/tasks', '/tasks'], taskRoutes);
app.use(['/api/daily-plan', '/daily-plan'], dailyPlanRoutes);
app.use(['/api/dsa', '/dsa'], dsaRoutes);
app.use(['/api/aptitude', '/aptitude'], aptitudeRoutes);
app.use(['/api/technical', '/technical'], technicalRoutes);
app.use(['/api/communication', '/communication'], communicationRoutes);
app.use(['/api/interviews', '/interviews'], interviewRoutes);
app.use(['/api/applications', '/applications'], applicationRoutes);
app.use(['/api/study-time', '/study-time'], studyTimeRoutes);
app.use(['/api/goals', '/goals'], goalRoutes);
app.use(['/api/analytics', '/analytics'], analyticsRoutes);
app.use(['/api/achievements', '/achievements'], achievementRoutes);
app.use(['/api/notifications', '/notifications'], notificationRoutes);
app.use(['/api/seed', '/seed'], seedRoutes);
app.use(['/api', '/'], projectResumeRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
