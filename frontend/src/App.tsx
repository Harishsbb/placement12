import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MainLayout } from './layouts/MainLayout';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { TodayPlanPage } from './pages/TodayPlanPage';
import { TasksPage } from './pages/TasksPage';
import { DSATrackerPage } from './pages/DSATrackerPage';
import { AptitudePage } from './pages/AptitudePage';
import { TechnicalPage } from './pages/TechnicalPage';
import { CommunicationPage } from './pages/CommunicationPage';
import { InterviewPage } from './pages/InterviewPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { ProjectsResumePage } from './pages/ProjectsResumePage';
import { CalendarPage } from './pages/CalendarPage';
import { StudyTimePage } from './pages/StudyTimePage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { GoalsPage } from './pages/GoalsPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Main Layout */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="today" element={<TodayPlanPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="dsa" element={<DSATrackerPage />} />
            <Route path="aptitude" element={<AptitudePage />} />
            <Route path="technical" element={<TechnicalPage />} />
            <Route path="communication" element={<CommunicationPage />} />
            <Route path="interviews" element={<InterviewPage />} />
            <Route path="applications" element={<ApplicationsPage />} />
            <Route path="projects" element={<ProjectsResumePage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="study-time" element={<StudyTimePage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="goals" element={<GoalsPage />} />
            <Route path="achievements" element={<AchievementsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
