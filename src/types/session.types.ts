// ============================================================
// Types — Session
// ============================================================

export interface ISession {
  _id: string;
  sessionId: string;
  ownerName: string;
  createdAt: Date;
  expiresAt: Date;
  totalResponses: number;
}

export interface ISessionPublic {
  sessionId: string;
  ownerName: string;
  createdAt: string;
  expiresAt: string;
  totalResponses: number;
  isExpired: boolean;
}

export interface CreateSessionInput {
  ownerName: string;
}

export interface CreateSessionResponse {
  sessionId: string;
  ownerName: string;
  shareUrl: string;
  dashboardUrl: string;
  expiresAt: string;
}
