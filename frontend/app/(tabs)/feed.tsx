import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Card, Page } from '@/components/layout';
import { ScreenTitle, ThemeToggle } from '@/components/ui';
import { signalsApi, SignalRecord } from '@/api/signals';
import { useTheme } from '@/context/ThemeContext';

type FeedFilter = 'all' | 'parsed' | 'rejected';

const filters: { id: FeedFilter; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'all', label: 'All activity', icon: 'list-outline' },
  { id: 'parsed', label: 'Executed', icon: 'checkmark-circle-outline' },
  { id: 'rejected', label: 'Skipped', icon: 'close-circle-outline' },
];

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function Feed() {
  const { colors } = useTheme();
  const [activeFilter, setActiveFilter] = useState<FeedFilter>('all');
  const [signals, setSignals] = useState<SignalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    signalsApi.getSignals({ limit: 50 })
      .then(setSignals)
      .catch(() => setError('Failed to load trade feed'))
      .finally(() => setIsLoading(false));
  }, []);

  const visibleSignals = useMemo(() => {
    if (activeFilter === 'all') return signals;
    return signals.filter((s) => s.status === activeFilter);
  }, [activeFilter, signals]);

  return (
    <Page>
      <ScreenTitle eyebrow="Real time" title="Trade feed" action={<ThemeToggle />} />

      <View style={[s.filterBar, { backgroundColor: colors.elevated, borderColor: colors.border }]}>
        {filters.map((filter) => {
          const selected = filter.id === activeFilter;
          const selectedColor = filter.id === 'rejected' ? colors.tradeLoss : colors.cyan;
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

      {isLoading ? (
        <ActivityIndicator color={colors.cyan} style={{ marginTop: 40 }} />
      ) : error ? (
        <View style={[s.empty, { borderColor: colors.border, backgroundColor: colors.elevated }]}>
          <Ionicons name="cloud-offline-outline" size={26} color={colors.tradeLoss} />
          <Text style={[s.emptyTitle, { color: colors.text }]}>Could not load feed</Text>
          <Text style={[s.emptyCopy, { color: colors.muted }]}>{error}</Text>
        </View>
      ) : (
        <>
          <Text style={[s.resultsLabel, { color: colors.muted }]}>
            {visibleSignals.length} {visibleSignals.length === 1 ? 'signal' : 'signals'}
          </Text>
          {visibleSignals.length ? (
            visibleSignals.map((signal) => <SignalCard key={signal.id} signal={signal} />)
          ) : (
            <View style={[s.empty, { borderColor: colors.border, backgroundColor: colors.elevated }]}>
              <Ionicons name="checkmark-circle-outline" size={26} color={colors.tradeProfit} />
              <Text style={[s.emptyTitle, { color: colors.text }]}>No signals yet</Text>
              <Text style={[s.emptyCopy, { color: colors.muted }]}>
                Connect a Telegram channel to start receiving signals.
              </Text>
            </View>
          )}
        </>
      )}
    </Page>
  );
}

function SignalCard({ signal }: { signal: SignalRecord }) {
  const { colors } = useTheme();
  const payload = signal.parsed_payload;
  const action = payload?.action ?? '—';
  const symbol = payload?.symbol ?? 'Unknown';
  const isParsed = signal.status === 'parsed';
  const provider = signal.source?.display_name ?? 'Unknown Source';

  return (
    <Card style={[s.card, { backgroundColor: colors.elevated, borderColor: colors.border }]}>
      <View style={s.row}>
        <View style={s.tradeInfo}>
          <View style={s.symbolRow}>
            <View style={[s.sideTag, { backgroundColor: action === 'BUY' ? colors.successSurface : colors.dangerSurface }]}>
              <Text style={[s.sideText, { color: action === 'BUY' ? colors.tradeProfit : colors.tradeLoss }]}>
                {action.toUpperCase()}
              </Text>
            </View>
            <Text style={[s.symbol, { color: colors.text }]}>{symbol}</Text>
          </View>
          <Text style={[s.meta, { color: colors.muted }]}>From {provider} · {timeAgo(signal.received_at)}</Text>
        </View>
        <View style={s.amountColumn}>
          <View style={[
            s.statusBadge,
            { backgroundColor: isParsed ? colors.successSurface : colors.dangerSurface }
          ]}>
            <Ionicons
              name={isParsed ? 'checkmark-circle' : 'close-circle'}
              size={12}
              color={isParsed ? colors.tradeProfit : colors.tradeLoss}
            />
            <Text style={[s.statusText, { color: isParsed ? colors.tradeProfit : colors.tradeLoss }]}>
              {isParsed ? 'Parsed' : signal.status === 'rejected' ? 'Rejected' : 'Pending'}
            </Text>
          </View>
          <Text style={[s.confidence, { color: colors.subtle }]}>
            {Math.round(signal.parse_confidence * 100)}% confidence
          </Text>
        </View>
      </View>
      {payload && (
        <View style={[s.footer, { borderTopColor: colors.border }]}>
          {payload.entry != null && (
            <View style={s.level}>
              <Text style={[s.levelLabel, { color: colors.subtle }]}>ENTRY</Text>
              <Text style={[s.levelValue, { color: colors.text }]}>{payload.entry}</Text>
            </View>
          )}
          {payload.stopLoss != null && (
            <View style={s.level}>
              <Text style={[s.levelLabel, { color: colors.subtle }]}>S/L</Text>
              <Text style={[s.levelValue, { color: colors.tradeLoss }]}>{payload.stopLoss}</Text>
            </View>
          )}
          {payload.takeProfits && payload.takeProfits.length > 0 && (
            <View style={s.level}>
              <Text style={[s.levelLabel, { color: colors.subtle }]}>T/P</Text>
              <Text style={[s.levelValue, { color: colors.tradeProfit }]}>{payload.takeProfits[0]}</Text>
            </View>
          )}
        </View>
      )}
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
  amountColumn: { alignItems: 'flex-end', marginLeft: 12, gap: 6 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  statusText: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 0.3 },
  confidence: { fontFamily: 'Inter_400Regular', fontSize: 10 },
  footer: { borderTopWidth: 1, marginTop: 14, paddingTop: 11, flexDirection: 'row', gap: 20 },
  level: { gap: 2 },
  levelLabel: { fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 0.7 },
  levelValue: { fontFamily: 'Inter_600SemiBold', fontSize: 13, letterSpacing: 0.1 },
  empty: { minHeight: 150, borderWidth: 1, borderRadius: 16, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emptyTitle: { fontFamily: 'Inter_700Bold', fontSize: 16, marginTop: 10 },
  emptyCopy: { fontFamily: 'Inter_400Regular', fontSize: 12, textAlign: 'center', marginTop: 5, lineHeight: 18 },
});
