# 🚀 Placement Quest — 30-Day Placement Preparation Platform

Placement Quest is a full-stack MERN application designed to help students prepare for campus placements while balancing college, technical preparation, communication, aptitude, interview practice, relaxation, and job applications.

## 🎯 Features

- **30-Day Challenge System**: Track day 1 to 30 placement journey with XP, levels, and badges.
- **Daily Evening Plan**: Custom schedule optimized for college students (8:00 AM – 5:30 PM college schedule).
- **DSA Tracker**: Categorized problem logging by topic, difficulty (Easy/Medium/Hard), and platform links.
- **Aptitude Tracker**: Quantitative, Logical, and Verbal ability progress tracking with accuracy breakdown.
- **Technical Prep**: Computer Science core (OOP, OS, DBMS, Networks, Web Dev, Programming languages).
- **Communication & Interview Prep**: Mock interview scores, speaking logs, feedback, and GD notes.
- **Project & Resume Preparation**: Resume version tracking, ATS score logs, and project interview Q&A.
- **Job Application Tracker**: Complete application funnel (Wishlist -> Applied -> Assessment -> Interview -> Offer).
- **Gamification**: XP points, Level titles (DSA Warrior, Interview Ready, etc.), daily streaks, and achievement badges.
- **Analytics & Calendar**: Visual progress graphs via Recharts, study time tracking, and interactive calendar.

## 🛠 Tech Stack

- **Frontend**: React, Vite, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons, Recharts, Axios, React Router v6
- **Backend**: Node.js, Express.js, TypeScript, REST APIs, Mongoose, JWT Authentication, bcryptjs
- **Database**: MongoDB Atlas / Local MongoDB

## 🚀 Quick Start

### 1. Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Variables
Create `.env` in `backend/`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/placement-quest
JWT_SECRET=placement_quest_super_secret_jwt_key_2026
CLIENT_URL=http://localhost:5173
```

### 3. Run Development Servers
```bash
# Start backend
cd backend
npm run dev

# In another terminal, start frontend
cd frontend
npm run dev
```

Visit `http://localhost:5173` to access Placement Quest!
