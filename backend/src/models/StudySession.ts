import mongoose, { Schema, Document } from 'mongoose';

export interface IStudySession extends Document {
  userId: mongoose.Types.ObjectId;
  subject: string;
  category: 'Technical / DSA' | 'Aptitude' | 'Communication' | 'Interview' | 'Other';
  startTime: string;
  endTime: string;
  durationMinutes: number;
  notes?: string;
  date: string;
}

const StudySessionSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true },
    category: {
      type: String,
      enum: ['Technical / DSA', 'Aptitude', 'Communication', 'Interview', 'Other'],
      default: 'Technical / DSA'
    },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    durationMinutes: { type: Number, required: true },
    notes: { type: String, default: '' },
    date: { type: String, required: true }
  },
  { timestamps: true }
);

export default (mongoose.models.StudySession as mongoose.Model<IStudySession>) || mongoose.model<IStudySession>('StudySession', StudySessionSchema);
