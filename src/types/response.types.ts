// ============================================================
// Types — Response / Vote
// ============================================================

export type AppreciationType =
  | 'Kindness'
  | 'Laughter'
  | 'Positivity'
  | 'Support'
  | 'Motivation'
  | 'Inspiration'
  | 'Comfort'
  | 'Strength'
  | 'Confidence'
  | 'Focus'
  | 'Happiness'
  | 'Wisdom';

export interface AppreciationOption {
  type: AppreciationType;
  emoji: string;
  label: string;
  color: string;
  bgColor: string;
}

export interface IResponse {
  _id: string;
  sessionId: string;
  appreciationType: AppreciationType;
  ipHash: string;
  createdAt: Date;
  expiresAt: Date;
}

export interface SubmitVoteInput {
  sessionId: string;
  appreciationType: AppreciationType;
}

export interface SubmitVoteResponse {
  success: boolean;
  message: string;
}

export interface AppreciationCount {
  type: AppreciationType;
  emoji: string;
  label: string;
  count: number;
  percentage: number;
  color: string;
  bgColor: string;
}

export interface SessionResults {
  sessionId: string;
  ownerName: string;
  totalResponses: number;
  topAppreciation: AppreciationCount | null;
  secondaryAppreciation: AppreciationCount | null;
  hiddenStrength: AppreciationCount | null;
  distribution: AppreciationCount[];
  isExpired: boolean;
  expiresAt: string;
}

export interface IAnalytics {
  _id: string;
  sessionId: string;
  totalViews: number;
  totalResponses: number;
  shares: number;
  expiresAt: Date;
}
