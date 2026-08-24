import mongoose, { Schema, Document } from 'mongoose';

export interface IGoal extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  target: number;
  currentProgress: number;
  unit: string;
  category: string;
  deadline: string;
  status: 'In Progress' | 'Completed' | 'Failed';
}

const GoalSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    target: { type: Number, required: true },
    currentProgress: { type: Number, default: 0 },
    unit: { type: String, default: 'problems' },
    category: { type: String, default: 'DSA' },
    deadline: { type: String, required: true },
    status: { type: String, enum: ['In Progress', 'Completed', 'Failed'], default: 'In Progress' }
  },
  { timestamps: true }
);

export default (mongoose.models.Goal as mongoose.Model<IGoal>) || mongoose.model<IGoal>('Goal', GoalSchema);
