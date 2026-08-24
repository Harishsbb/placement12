import mongoose, { Schema, Document } from 'mongoose';

export interface IResume extends Document {
  userId: mongoose.Types.ObjectId;
  version: string;
  lastUpdated: string;
  atsScore: number;
  projects: string[];
  skills: string[];
  achievements: string[];
  certifications: string[];
}

const ResumeSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    version: { type: String, default: 'v1.0' },
    lastUpdated: { type: String, required: true },
    atsScore: { type: Number, default: 85 },
    projects: { type: [String], default: [] },
    skills: { type: [String], default: [] },
    achievements: { type: [String], default: [] },
    certifications: { type: [String], default: [] }
  },
  { timestamps: true }
);

export default (mongoose.models.Resume as mongoose.Model<IResume>) || mongoose.model<IResume>('Resume', ResumeSchema);
