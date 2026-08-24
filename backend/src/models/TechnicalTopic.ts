import mongoose, { Schema, Document } from 'mongoose';

export interface ITechnicalTopic extends Document {
  userId: mongoose.Types.ObjectId;
  category: 'Programming' | 'DSA' | 'Database' | 'Web Development' | 'Core CS';
  topicName: string;
  subTopics?: string[];
  status: 'Not Started' | 'Learning' | 'Revised' | 'Mastered';
  notes?: string;
}

const TechnicalTopicSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: {
      type: String,
      enum: ['Programming', 'DSA', 'Database', 'Web Development', 'Core CS'],
      required: true
    },
    topicName: { type: String, required: true },
    subTopics: { type: [String], default: [] },
    status: { type: String, enum: ['Not Started', 'Learning', 'Revised', 'Mastered'], default: 'Learning' },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

export default (mongoose.models.TechnicalTopic as mongoose.Model<ITechnicalTopic>) || mongoose.model<ITechnicalTopic>('TechnicalTopic', TechnicalTopicSchema);
