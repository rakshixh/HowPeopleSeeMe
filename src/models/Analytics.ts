// ============================================================
// Analytics Model
// ============================================================

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAnalyticsDocument extends Document {
  sessionId: string;
  totalViews: number;
  totalResponses: number;
  shares: number;
  expiresAt: Date;
}

const AnalyticsSchema = new Schema<IAnalyticsDocument>(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    totalViews: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalResponses: {
      type: Number,
      default: 0,
      min: 0,
    },
    shares: {
      type: Number,
      default: 0,
      min: 0,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 }, // TTL index
    },
  },
  {
    timestamps: true,
    collection: 'analytics',
  }
);

const Analytics: Model<IAnalyticsDocument> =
  mongoose.models.Analytics ||
  mongoose.model<IAnalyticsDocument>('Analytics', AnalyticsSchema);

export default Analytics;
