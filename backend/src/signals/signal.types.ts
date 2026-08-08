export type SignalSide = 'buy' | 'sell';

export interface ParsedSignal {
  side: SignalSide;
  symbol: string;
  entryPrice?: number;
  stopLoss?: number;
  takeProfits: number[];
}

export interface SignalParseResult {
  status: 'parsed' | 'unresolved';
  confidence: number;
  signal?: ParsedSignal;
  reasons: string[];
}
