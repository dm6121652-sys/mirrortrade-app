export type Trade = { id: string; symbol: string; side: 'BUY' | 'SELL'; provider: string; price: string; pnl: number; status: 'Executed' | 'Pending' | 'Failed'; time: string };
export const trades: Trade[] = [
  { id: 'mt-2041', symbol: 'XAU/USD', side: 'BUY', provider: 'Atlas Signals', price: '2,365.42', pnl: 84.2, status: 'Executed', time: 'Just now' },
  { id: 'mt-2040', symbol: 'EUR/USD', side: 'SELL', provider: 'Nova FX', price: '1.08452', pnl: 31.6, status: 'Executed', time: '14m ago' },
  { id: 'mt-2039', symbol: 'GBP/JPY', side: 'BUY', provider: 'Atlas Signals', price: '206.420', pnl: -12.4, status: 'Executed', time: '32m ago' },
];
export const providers = [
  { name: 'Atlas Signals', initials: 'AS', winRate: '78%', rr: '1:2.4', followers: '2.4k', mode: 'Manual', color: '#00D4AA' },
  { name: 'Nova FX', initials: 'NF', winRate: '72%', rr: '1:1.9', followers: '1.8k', mode: 'Auto', color: '#7C5CFF' },
  { name: 'Pip Theory', initials: 'PT', winRate: '69%', rr: '1:2.1', followers: '986', mode: 'Manual', color: '#0B8CFF' },
];
