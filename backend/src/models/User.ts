import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
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
  lastActiveDate: Date;
  missionDay: number;
  isMissionCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    college: { type: String, default: 'Engineering College' },
    degree: { type: String, default: 'B.Tech CS' },
    graduationYear: { type: String, default: '2026' },
    targetRole: { type: String, default: 'Software Development Engineer' },
    targetCompanies: { type: [String], default: ['Google', 'Microsoft', 'Amazon', 'Atlassian', 'TCS'] },
    profileImage: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    rankTitle: { type: String, default: 'Beginner' },
    streak: { type: Number, default: 0 },
    bestStreak: { type: Number, default: 0 },
    lastActiveDate: { type: Date, default: Date.now },
    missionDay: { type: Number, default: 1 },
    isMissionCompleted: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model<IUser>('User', UserSchema);
