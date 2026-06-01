// ============================================================
// Session Model
// ============================================================

import mongoose, { Schema, Document, Model } from 'mongoose';
import { SESSION_LIFETIME_MS } from '@/lib/constants';

export interface ISessionDocument extends Document {
  sessionId: string;
  ownerName: string;
  createdAt: Date;
  expiresAt: Date;
  totalResponses: number;
}

const SessionSchema = new Schema<ISessionDocument>(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      minlength: 6,
      maxlength: 16,
    },
    ownerName: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 50,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + SESSION_LIFETIME_MS),
      index: { expireAfterSeconds: 0 }, // TTL index — MongoDB auto-deletes
    },
    totalResponses: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true, // adds createdAt, updatedAt
    collection: 'sessions',
  }
);

// Prevent model recompilation in Next.js hot reload
const Session: Model<ISessionDocument> =
  mongoose.models.Session ||
  mongoose.model<ISessionDocument>('Session', SessionSchema);

export default Session;
