import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card, Page } from '@/components/layout';
import { ScreenTitle, ThemeToggle } from '@/components/ui';
import { trades, type Trade } from '@/data/demo';
import { useTheme } from '@/context/ThemeContext';

type FeedFilter = 'all' | 'executed' | 'skipped';

const filters: { id: FeedFilter; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'all', label: 'All activity', icon: 'list-outline' },
  { id: 'executed', label: 'Executed', icon: 'checkmark-circle-outline' },
  { id: 'skipped', label: 'Skipped', icon: 'close-circle-outline' },
];

export default function Feed() {
  const { colors } = useTheme();
  const [activeFilter, setActiveFilter] = useState<FeedFilter>('all');

  const visibleTrades = useMemo(() => {
    if (activeFilter === 'all') return trades;
    if (activeFilter === 'executed') return trades.filter((trade) => trade.status === 'Executed');
    return trades.filter((trade) => trade.status === 'Failed');
  }, [activeFilter]);

  return (
    <Page>
      <ScreenTitle eyebrow="Real time" title="Trade feed" action={<ThemeToggle />} />

      <View style={[s.filterBar, { backgroundColor: colors.elevated, borderColor: colors.border }]}>
        {filters.map((filter) => {
          const selected = filter.id === activeFilter;
          const selectedColor = filter.id === 'skipped' ? colors.tradeLoss : colors.cyan;
          return (
            <Pressable
              key={filter.id}
              onPress={() => setActiveFilter(filter.id)}
              style={({ pressed }) => [
                s.filter,
                selected && { backgroundColor: `${selectedColor}18` },
                pressed && { opacity: 0.7 },
              ]}
            >
              <Ionicons name={filter.icon} size={14} color={selected ? selectedColor : colors.subtle} />
              <Text style={[s.filterText, { color: selected ? selectedColor : colors.subtle }]}>
                {filter.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={[s.resultsLabel, { color: colors.muted }]}>
        {visibleTrades.length} {visibleTrades.length === 1 ? 'trade' : 'trades'}
      </Text>

      {visibleTrades.length ? (
        visibleTrades.map((trade) => <TradeCard key={trade.id} trade={trade} />)
      ) : (
        <View style={[s.empty, { borderColor: colors.border, backgroundColor: colors.elevated }]}>
          <Ionicons name="checkmark-circle-outline" size={26} color={colors.tradeProfit} />
          <Text style={[s.emptyTitle, { color: colors.text }]}>No skipped trades</Text>
          <Text style={[s.emptyCopy, { color: colors.muted }]}>Every signal in this session was processed successfully.</Text>
        </View>
      )}
    </Page>
  );
}

function TradeCard({ trade }: { trade: Trade }) {
  const { colors } = useTheme();
  const isProfit = trade.pnl >= 0;
  const status = trade.status === 'Failed' ? 'Skipped' : trade.status;

  return (
    <Card style={[s.card, { backgroundColor: colors.elevated, borderColor: colors.border }]}>
      <View style={s.row}>
        <View style={s.tradeInfo}>
          <View style={s.symbolRow}>
            <View style={[s.sideTag, { backgroundColor: trade.side === 'BUY' ? colors.successSurface : colors.dangerSurface }]}>
              <Text style={[s.sideText, { color: trade.side === 'BUY' ? colors.tradeProfit : colors.tradeLoss }]}>
                {trade.side}
              </Text>
            </View>
            <Text style={[s.symbol, { color: colors.text }]}>{trade.symbol}</Text>
          </View>
          <Text style={[s.meta, { color: colors.muted }]}>From {trade.provider} · {trade.time}</Text>
        </View>
        <View style={s.amountColumn}>
          <Text style={[s.pnl, { color: isProfit ? colors.tradeProfit : colors.tradeLoss }]}>
            {isProfit ? '+' : ''}${trade.pnl.toFixed(2)}
          </Text>
          <Text style={[s.status, { color: isProfit ? colors.tradeProfit : colors.tradeLoss }]}>{status}</Text>
        </View>
      </View>
      <View style={[s.footer, { borderTopColor: colors.border }]}>
        <Text style={[s.executionLabel, { color: colors.subtle }]}>EXECUTION PRICE</Text>
        <Text style={[s.price, { color: colors.text }]}>{trade.price}</Text>
      </View>
    </Card>
  );
}

const s = StyleSheet.create({
  filterBar: { flexDirection: 'row', gap: 4, padding: 4, borderRadius: 13, borderWidth: 1, marginBottom: 16 },
  filter: { flex: 1, minHeight: 38, borderRadius: 9, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingHorizontal: 4 },
  filterText: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 0.1 },
  resultsLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 11, marginBottom: 9 },
  card: { marginBottom: 10, padding: 15, borderWidth: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  tradeInfo: { flex: 1, minWidth: 0 },
  symbolRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sideTag: { borderRadius: 7, paddingHorizontal: 7, paddingVertical: 4 },
  sideText: { fontFamily: 'Inter_800ExtraBold', fontSize: 9, letterSpacing: 0.4 },
  symbol: { fontFamily: 'Inter_700Bold', fontSize: 16, letterSpacing: -0.2 },
  meta: { fontFamily: 'Inter_500Medium', fontSize: 12, marginTop: 7 },
  amountColumn: { alignItems: 'flex-end', marginLeft: 12 },
  pnl: { fontFamily: 'Inter_600SemiBold', fontSize: 16, letterSpacing: -0.2 },
  status: { fontFamily: 'Inter_700Bold', fontSize: 10, marginTop: 5, letterSpacing: 0.3, textTransform: 'uppercase' },
  footer: { borderTopWidth: 1, marginTop: 14, paddingTop: 11, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  executionLabel: { fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 0.7 },
  price: { fontFamily: 'Inter_600SemiBold', fontSize: 13, letterSpacing: 0.1 },
  empty: { minHeight: 150, borderWidth: 1, borderRadius: 16, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emptyTitle: { fontFamily: 'Inter_700Bold', fontSize: 16, marginTop: 10 },
  emptyCopy: { fontFamily: 'Inter_400Regular', fontSize: 12, textAlign: 'center', marginTop: 5, lineHeight: 18 },
});
