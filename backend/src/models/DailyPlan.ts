import mongoose, { Schema, Document } from 'mongoose';

export interface IScheduleSlot {
  _id?: string;
  timeRange: string;
  activity: string;
  category: string;
  isCompleted: boolean;
  notes?: string;
}

export interface IDailyPlan extends Document {
  userId: mongoose.Types.ObjectId;
  date: string;
  slots: IScheduleSlot[];
}

const DailyPlanSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true },
    slots: [
      {
        timeRange: { type: String, required: true },
        activity: { type: String, required: true },
        category: { type: String, required: true },
        isCompleted: { type: Boolean, default: false },
        notes: { type: String, default: '' }
      }
    ]
  },
  { timestamps: true }
);

export default (mongoose.models.DailyPlan as mongoose.Model<IDailyPlan>) || mongoose.model<IDailyPlan>('DailyPlan', DailyPlanSchema);
