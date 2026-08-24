import mongoose, { Schema, Document } from 'mongoose';

export interface IDSAProblem extends Document {
  userId: mongoose.Types.ObjectId;
  problemName: string;
  platform: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  status: 'Solved' | 'Attempted' | 'Bookmarked';
  solvedDate: string;
  timeTaken: number; // minutes
  solutionLink?: string;
  notes?: string;
}

const DSAProblemSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    problemName: { type: String, required: true },
    platform: { type: String, default: 'LeetCode' },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    topic: { type: String, default: 'Arrays' },
    status: { type: String, enum: ['Solved', 'Attempted', 'Bookmarked'], default: 'Solved' },
    solvedDate: { type: String, required: true },
    timeTaken: { type: Number, default: 30 },
    solutionLink: { type: String, default: '' },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

export default mongoose.model<IDSAProblem>('DSAProblem', DSAProblemSchema);
