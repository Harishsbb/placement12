import mongoose, { Schema, Document } from 'mongoose';

export interface IJobApplication extends Document {
  userId: mongoose.Types.ObjectId;
  company: string;
  jobRole: string;
  location?: string;
  applicationLink?: string;
  appliedDate: string;
  deadline?: string;
  salary?: string;
  status: 'Wishlist' | 'Applied' | 'Assessment' | 'Shortlisted' | 'Interview' | 'HR' | 'Offer' | 'Rejected' | 'Withdrawn';
  interviewDate?: string;
  notes?: string;
}

const JobApplicationSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    company: { type: String, required: true },
    jobRole: { type: String, required: true },
    location: { type: String, default: 'Remote / Hybrid' },
    applicationLink: { type: String, default: '' },
    appliedDate: { type: String, required: true },
    deadline: { type: String, default: '' },
    salary: { type: String, default: '12 - 18 LPA' },
    status: {
      type: String,
      enum: ['Wishlist', 'Applied', 'Assessment', 'Shortlisted', 'Interview', 'HR', 'Offer', 'Rejected', 'Withdrawn'],
      default: 'Applied'
    },
    interviewDate: { type: String, default: '' },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

export default mongoose.model<IJobApplication>('JobApplication', JobApplicationSchema);
