// ============================================================
// Response Model
// ============================================================

import mongoose, { Schema, Document, Model } from 'mongoose';
import { VALID_APPRECIATION_TYPES } from '@/lib/constants';

export interface IResponseDocument extends Document {
  sessionId: string;
  appreciationType: string;
  ipHash: string;
  createdAt: Date;
  expiresAt: Date;
}

const ResponseSchema = new Schema<IResponseDocument>(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    appreciationType: {
      type: String,
      required: true,
      enum: VALID_APPRECIATION_TYPES,
    },
    ipHash: {
      type: String,
      required: true,
      // Composite index: prevents duplicate vote per IP per session per type
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 }, // TTL index
    },
  },
  {
    timestamps: true,
    collection: 'responses',
  }
);

// Compound index for anti-spam: one vote per (sessionId + ipHash + appreciationType)
ResponseSchema.index(
  { sessionId: 1, ipHash: 1, appreciationType: 1 },
  { unique: true }
);

// Index for fast aggregation queries
ResponseSchema.index({ sessionId: 1, appreciationType: 1 });

const Response: Model<IResponseDocument> =
  mongoose.models.Response ||
  mongoose.model<IResponseDocument>('Response', ResponseSchema);

export default Response;
