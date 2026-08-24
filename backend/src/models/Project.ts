import mongoose, { Schema, Document } from 'mongoose';

export interface IProjectPrepQnA {
  question: string;
  answer: string;
}

export interface IProject extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  technology: string[];
  description: string;
  githubLink?: string;
  liveLink?: string;
  keyFeatures: string[];
  challenges?: string;
  solutions?: string;
  interviewQuestions: IProjectPrepQnA[];
}

const ProjectSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    technology: { type: [String], required: true },
    description: { type: String, required: true },
    githubLink: { type: String, default: '' },
    liveLink: { type: String, default: '' },
    keyFeatures: { type: [String], default: [] },
    challenges: { type: String, default: '' },
    solutions: { type: String, default: '' },
    interviewQuestions: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model<IProject>('Project', ProjectSchema);
