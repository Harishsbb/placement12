import mongoose, { Schema, Document } from 'mongoose';

export interface IAchievement extends Document {
  userId: mongoose.Types.ObjectId;
  code: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  unlockedAt?: Date;
  isUnlocked: boolean;
}

const AchievementSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    code: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, default: 'General' },
    icon: { type: String, default: '🏆' },
    unlockedAt: { type: Date },
    isUnlocked: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default (mongoose.models.Achievement as mongoose.Model<IAchievement>) || mongoose.model<IAchievement>('Achievement', AchievementSchema);
