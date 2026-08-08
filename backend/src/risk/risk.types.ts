export interface TradingProfileRiskSettings {
  copyTradingEnabled: boolean;
  killSwitchEnabled: boolean;
  maxRiskPerTrade: number;
  maxDailyLoss: number;
  maxOpenPositions: number;
  allowedSymbols: string[];
}

export interface BrokerAccountRiskContext {
  id: string;
  isDemo: boolean;
  status: 'pending' | 'active' | 'paused' | 'revoked';
}

export interface TradeRiskInput {
  signalId: string;
  sourceTrusted: boolean;
  symbol: string;
  estimatedRiskPercent: number;
  estimatedLoss: number;
  openPositionCount: number;
  realizedDailyLoss: number;
  account: BrokerAccountRiskContext;
  profile: TradingProfileRiskSettings;
}

export type RiskDecisionStatus = 'approved_for_review' | 'rejected';

export interface RiskDecision {
  status: RiskDecisionStatus;
  reasons: string[];
  evaluatedAt: string;
  policy: 'approval_demo';
}
