import { SignalParser } from './signal.parser';

describe('SignalParser', () => {
  const parser = new SignalParser();

  it('parses a complete BUY signal', () => {
    expect(parser.parse('BUY XAUUSD @ 2350.50 SL 2342 TP 2360 TP 2370')).toEqual({
      status: 'parsed',
      confidence: 1,
      signal: {
        side: 'buy',
        symbol: 'XAUUSD',
        entryPrice: 2350.5,
        stopLoss: 2342,
        takeProfits: [2360, 2370],
      },
      reasons: [],
    });
  });

  it('fails closed on incomplete signals', () => {
    const result = parser.parse('SELL EURUSD @ 1.1200');
    expect(result.status).toBe('unresolved');
    expect(result.reasons).toContain('Stop loss is missing.');
  });

  it('fails closed on inconsistent price levels', () => {
    const result = parser.parse('SELL XAUUSD @ 2350 SL 2340 TP 2360');
    expect(result.status).toBe('unresolved');
    expect(result.reasons).toContain('Price levels are inconsistent with the stated trade direction.');
  });
});
