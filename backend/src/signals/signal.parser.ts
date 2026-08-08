import { Injectable } from '@nestjs/common';
import { ParsedSignal, SignalParseResult, SignalSide } from './signal.types';

/**
 * Parses a deliberately narrow, auditable signal format, for example:
 * "BUY XAUUSD @ 2350.50 SL 2342.00 TP 2360.00 TP 2370.00"
 * Ambiguous content is returned as unresolved and must never create an order.
 */
@Injectable()
export class SignalParser {
  parse(message: string): SignalParseResult {
    const normalized = message.replace(/\s+/g, ' ').trim().toUpperCase();
    const primary = normalized.match(/\b(BUY|SELL)\s+([A-Z0-9/]{3,15})\b/);
    if (!primary) return this.unresolved('No supported BUY or SELL instruction was found.');

    const [, sideValue, rawSymbol] = primary;
    const side = sideValue.toLowerCase() as SignalSide;
    const symbol = rawSymbol.replace('/', '');
    const entryPrice = this.firstNumber(normalized, /(?:\bENTRY\b|@)\s*([0-9]+(?:\.[0-9]+)?)/);
    const stopLoss = this.firstNumber(normalized, /(?:\bSL\b|\bSTOP[- ]?LOSS\b)\s*[:@-]?\s*([0-9]+(?:\.[0-9]+)?)/);
    const takeProfits = [...normalized.matchAll(/\bTP(?:\d+)?\b\s*[:@-]?\s*([0-9]+(?:\.[0-9]+)?)/g)]
      .map((match) => Number(match[1]))
      .filter(Number.isFinite);

    const reasons: string[] = [];
    if (!entryPrice) reasons.push('Entry price is missing.');
    if (!stopLoss) reasons.push('Stop loss is missing.');
    if (takeProfits.length === 0) reasons.push('At least one take-profit target is required.');
    if (entryPrice && stopLoss && !this.hasValidDirection(side, entryPrice, stopLoss, takeProfits)) {
      reasons.push('Price levels are inconsistent with the stated trade direction.');
    }
    if (reasons.length > 0) return this.unresolved(...reasons);

    const signal: ParsedSignal = { side, symbol, entryPrice, stopLoss, takeProfits };
    return { status: 'parsed', confidence: 1, signal, reasons: [] };
  }

  private firstNumber(value: string, expression: RegExp): number | undefined {
    const match = value.match(expression);
    if (!match) return undefined;
    const parsed = Number(match[1]);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
  }

  private hasValidDirection(side: SignalSide, entry: number, stopLoss: number, takeProfits: number[]): boolean {
    if (side === 'buy') return stopLoss < entry && takeProfits.every((target) => target > entry);
    return stopLoss > entry && takeProfits.every((target) => target < entry);
  }

  private unresolved(...reasons: string[]): SignalParseResult {
    return { status: 'unresolved', confidence: 0, reasons };
  }
}
