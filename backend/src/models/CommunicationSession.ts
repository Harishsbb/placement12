import mongoose, { Schema, Document } from 'mongoose';

export interface ICommunicationSession extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'Speaking Practice' | 'Listening Practice' | 'Vocabulary' | 'Grammar' | 'Self Introduction' | 'Group Discussion' | 'Presentation' | 'English Conversation';
  duration: number; // minutes
  topic: string;
  confidence: number; // 1-10
  notes?: string;
  improvementPoints?: string;
  date: string;
}

const CommunicationSessionSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: [
        'Speaking Practice',
        'Listening Practice',
        'Vocabulary',
        'Grammar',
        'Self Introduction',
        'Group Discussion',
        'Presentation',
        'English Conversation'
      ],
      required: true
    },
    duration: { type: Number, default: 30 },
    topic: { type: String, required: true },
    confidence: { type: Number, default: 7 },
    notes: { type: String, default: '' },
    improvementPoints: { type: String, default: '' },
    date: { type: String, required: true }
  },
  { timestamps: true }
);

export default (mongoose.models.CommunicationSession as mongoose.Model<ICommunicationSession>) || mongoose.model<ICommunicationSession>('CommunicationSession', CommunicationSessionSchema);
