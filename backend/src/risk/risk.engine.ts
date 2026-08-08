import { Injectable } from '@nestjs/common';
import { RiskDecision, TradeRiskInput } from './risk.types';

/**
 * Evaluates a proposal before it can enter the human approval queue.
 * This service is intentionally fail-closed: a decision never submits a broker order.
 */
@Injectable()
export class RiskEngine {
  evaluate(input: TradeRiskInput): RiskDecision {
    const reasons: string[] = [];
    const symbol = input.symbol.trim().toUpperCase();

    if (!input.sourceTrusted) reasons.push('Signal source is not trusted.');
    if (!input.account.isDemo) reasons.push('Live broker accounts are not permitted in approval-demo mode.');
    if (input.account.status !== 'active') reasons.push('Broker account is not active.');
    if (!input.profile.copyTradingEnabled) reasons.push('Copy trading is disabled for this profile.');
    if (input.profile.killSwitchEnabled) reasons.push('The account kill switch is enabled.');
    if (!input.profile.allowedSymbols.includes(symbol)) reasons.push(`Symbol ${symbol} is not allowed for this profile.`);

    if (!Number.isFinite(input.estimatedRiskPercent) || input.estimatedRiskPercent <= 0) {
      reasons.push('Estimated risk must be a positive number.');
    } else if (input.estimatedRiskPercent > input.profile.maxRiskPerTrade) {
      reasons.push('Estimated risk exceeds the maximum risk per trade.');
    }

    if (!Number.isFinite(input.estimatedLoss) || input.estimatedLoss < 0) {
      reasons.push('Estimated loss must be zero or greater.');
    } else if (input.realizedDailyLoss + input.estimatedLoss > input.profile.maxDailyLoss) {
      reasons.push('Proposed trade would exceed the daily loss limit.');
    }

    if (!Number.isInteger(input.openPositionCount) || input.openPositionCount < 0) {
      reasons.push('Open position count is invalid.');
    } else if (input.openPositionCount >= input.profile.maxOpenPositions) {
      reasons.push('Maximum open-position limit has been reached.');
    }

    return {
      status: reasons.length === 0 ? 'approved_for_review' : 'rejected',
      reasons,
      evaluatedAt: new Date().toISOString(),
      policy: 'approval_demo',
    };
  }
}
