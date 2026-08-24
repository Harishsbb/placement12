import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  category: 'Technical' | 'DSA' | 'Aptitude' | 'Communication' | 'Interview' | 'Project' | 'Resume' | 'Application' | 'Relaxation' | 'Other';
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
  startTime?: string;
  endTime?: string;
  estimatedDuration?: number;
  xp: number;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Skipped';
  notes?: string;
  isRecurring: boolean;
  recurrencePattern?: 'Daily' | 'Weekdays' | 'Weekly' | 'Custom';
  completedAt?: Date;
}

const TaskSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    category: {
      type: String,
      enum: ['Technical', 'DSA', 'Aptitude', 'Communication', 'Interview', 'Project', 'Resume', 'Application', 'Relaxation', 'Other'],
      default: 'Technical'
    },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    dueDate: { type: String, required: true },
    startTime: { type: String, default: '18:00' },
    endTime: { type: String, default: '19:00' },
    estimatedDuration: { type: Number, default: 60 },
    xp: { type: Number, default: 25 },
    status: { type: String, enum: ['Pending', 'In Progress', 'Completed', 'Skipped'], default: 'Pending' },
    notes: { type: String, default: '' },
    isRecurring: { type: Boolean, default: false },
    recurrencePattern: { type: String, enum: ['Daily', 'Weekdays', 'Weekly', 'Custom'], default: 'Daily' },
    completedAt: { type: Date }
  },
  { timestamps: true }
);

export default (mongoose.models.Task as mongoose.Model<ITask>) || mongoose.model<ITask>('Task', TaskSchema);
