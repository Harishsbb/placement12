import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestionAnswer {
  question: string;
  answer?: string;
  confidence?: number;
}

export interface IInterviewScore {
  technicalKnowledge: number; // 0-100
  communication: number; // 0-100
  confidence: number; // 0-100
  problemSolving: number; // 0-100
  projectKnowledge: number; // 0-100
  overallScore: number; // 0-100
}

export interface IInterview extends Document {
  userId: mongoose.Types.ObjectId;
  company: string;
  round: string;
  type: 'Technical' | 'HR' | 'Managerial' | 'Coding' | 'Group Discussion' | 'Mock Interview';
  date: string;
  questions: IQuestionAnswer[];
  feedback?: string;
  mistakes?: string;
  improvementAreas?: string;
  scoring: IInterviewScore;
}

const InterviewSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    company: { type: String, required: true },
    round: { type: String, default: 'Round 1 Technical' },
    type: {
      type: String,
      enum: ['Technical', 'HR', 'Managerial', 'Coding', 'Group Discussion', 'Mock Interview'],
      default: 'Technical'
    },
    date: { type: String, required: true },
    questions: [
      {
        question: { type: String, required: true },
        answer: { type: String, default: '' },
        confidence: { type: Number, default: 8 }
      }
    ],
    feedback: { type: String, default: '' },
    mistakes: { type: String, default: '' },
    improvementAreas: { type: String, default: '' },
    scoring: {
      technicalKnowledge: { type: Number, default: 75 },
      communication: { type: Number, default: 80 },
      confidence: { type: Number, default: 70 },
      problemSolving: { type: Number, default: 75 },
      projectKnowledge: { type: Number, default: 85 },
      overallScore: { type: Number, default: 77 }
    }
  },
  { timestamps: true }
);

export default (mongoose.models.Interview as mongoose.Model<IInterview>) || mongoose.model<IInterview>('Interview', InterviewSchema);
