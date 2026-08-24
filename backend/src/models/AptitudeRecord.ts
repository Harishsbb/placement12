import mongoose, { Schema, Document } from 'mongoose';

export interface IAptitudeRecord extends Document {
  userId: mongoose.Types.ObjectId;
  section: 'Quantitative' | 'Logical Reasoning' | 'Verbal Ability';
  topic: string;
  questionsAttempted: number;
  correct: number;
  incorrect: number;
  accuracy: number;
  timeTaken: number; // minutes
  date: string;
}

const AptitudeRecordSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    section: { type: String, enum: ['Quantitative', 'Logical Reasoning', 'Verbal Ability'], required: true },
    topic: { type: String, required: true },
    questionsAttempted: { type: Number, required: true },
    correct: { type: Number, required: true },
    incorrect: { type: Number, required: true },
    accuracy: { type: Number, required: true },
    timeTaken: { type: Number, default: 20 },
    date: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model<IAptitudeRecord>('AptitudeRecord', AptitudeRecordSchema);
