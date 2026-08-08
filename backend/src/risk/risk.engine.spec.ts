import { RiskEngine } from './risk.engine';
import { TradeRiskInput } from './risk.types';

const permittedProposal: TradeRiskInput = {
  signalId: 'signal-1',
  sourceTrusted: true,
  symbol: 'XAUUSD',
  estimatedRiskPercent: 1,
  estimatedLoss: 50,
  openPositionCount: 1,
  realizedDailyLoss: 100,
  account: { id: 'account-1', isDemo: true, status: 'active' },
  profile: {
    copyTradingEnabled: true,
    killSwitchEnabled: false,
    maxRiskPerTrade: 1,
    maxDailyLoss: 500,
    maxOpenPositions: 3,
    allowedSymbols: ['XAUUSD'],
  },
};

describe('RiskEngine', () => {
  const engine = new RiskEngine();

  it('permits a valid demo proposal into human review', () => {
    expect(engine.evaluate(permittedProposal).status).toBe('approved_for_review');
  });

  it('rejects live accounts even when other checks pass', () => {
    const decision = engine.evaluate({
      ...permittedProposal,
      account: { ...permittedProposal.account, isDemo: false },
    });

    expect(decision.status).toBe('rejected');
    expect(decision.reasons).toContain('Live broker accounts are not permitted in approval-demo mode.');
  });

  it('rejects a proposal when the kill switch is enabled', () => {
    const decision = engine.evaluate({
      ...permittedProposal,
      profile: { ...permittedProposal.profile, killSwitchEnabled: true },
    });

    expect(decision.status).toBe('rejected');
  });
});
