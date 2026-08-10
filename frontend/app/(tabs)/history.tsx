import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Card, Page } from '@/components/layout';
import { ScreenTitle, ThemeToggle } from '@/components/ui';
import { signalsApi, SignalRecord } from '@/api/signals';
import { useTheme } from '@/context/ThemeContext';

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function History() {
  const { colors } = useTheme();
  const [signals, setSignals] = useState<SignalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    signalsApi.getSignals({ limit: 100 })
      .then(setSignals)
      .catch(() => setError('Failed to load history'))
      .finally(() => setIsLoading(false));
  }, []);

  const parsedCount = signals.filter((s) => s.status === 'parsed').length;
  const rejectedCount = signals.filter((s) => s.status === 'rejected').length;

  return (
    <Page>
      <ScreenTitle eyebrow="Account activity" title="History" action={<ThemeToggle />} />

      <Card style={[s.summaryCard, { backgroundColor: colors.elevated, borderColor: colors.border }]}>
        <Text style={[s.label, { color: colors.subtle }]}>TOTAL SIGNALS RECEIVED</Text>
        <Text style={[s.total, { color: colors.text }]}>{isLoading ? '—' : signals.length}</Text>
        <Text style={[s.copy, { color: colors.muted }]}>
          {parsedCount} parsed · {rejectedCount} rejected
        </Text>
        <View style={[s.divider, { backgroundColor: colors.border }]} />
        <View style={s.statsRow}>
          <View style={s.stat}>
            <Text style={[s.statValue, { color: colors.tradeProfit }]}>{parsedCount}</Text>
            <Text style={[s.statLabel, { color: colors.subtle }]}>Executed</Text>
          </View>
          <View style={[s.statDivider, { backgroundColor: colors.border }]} />
          <View style={s.stat}>
            <Text style={[s.statValue, { color: colors.tradeLoss }]}>{rejectedCount}</Text>
            <Text style={[s.statLabel, { color: colors.subtle }]}>Rejected</Text>
          </View>
          <View style={[s.statDivider, { backgroundColor: colors.border }]} />
          <View style={s.stat}>
            <Text style={[s.statValue, { color: colors.cyan }]}>
              {signals.length > 0 ? `${Math.round((parsedCount / signals.length) * 100)}%` : '—'}
            </Text>
            <Text style={[s.statLabel, { color: colors.subtle }]}>Parse Rate</Text>
          </View>
        </View>
      </Card>

      {isLoading ? (
        <ActivityIndicator color={colors.cyan} style={{ marginTop: 40 }} />
      ) : error ? (
        <View style={[s.empty, { borderColor: colors.border, backgroundColor: colors.elevated }]}>
          <Ionicons name="cloud-offline-outline" size={26} color={colors.tradeLoss} />
          <Text style={[s.emptyTitle, { color: colors.text }]}>Could not load history</Text>
          <Text style={[s.emptyCopy, { color: colors.muted }]}>{error}</Text>
        </View>
      ) : signals.length === 0 ? (
        <View style={s.empty}>
          <View style={[s.icon, { backgroundColor: colors.successSurface }]}>
            <Ionicons name="receipt-outline" color={colors.cyan} size={28} />
          </View>
          <Text style={[s.emptyTitle, { color: colors.text }]}>No signals yet</Text>
          <Text style={[s.emptyCopy, { color: colors.muted }]}>
            Connect a Telegram channel to start receiving trading signals.
          </Text>
        </View>
      ) : (
        <>
          <Text style={[s.sectionTitle, { color: colors.text }]}>Recent Signals</Text>
          {signals.map((signal) => {
            const payload = signal.parsed_payload;
            const action = payload?.action ?? '—';
            const symbol = payload?.symbol ?? 'Unknown pair';
            const isParsed = signal.status === 'parsed';
            return (
              <View key={signal.id} style={[s.row, { borderBottomColor: colors.border }]}>
                <View style={[
                  s.sideTag,
                  { backgroundColor: action === 'BUY' ? colors.successSurface : action === 'SELL' ? colors.dangerSurface : colors.elevated }
                ]}>
                  <Text style={[
                    s.sideText,
                    { color: action === 'BUY' ? colors.tradeProfit : action === 'SELL' ? colors.tradeLoss : colors.subtle }
                  ]}>
                    {action}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[s.symbol, { color: colors.text }]}>{symbol}</Text>
                  <Text style={[s.meta, { color: colors.subtle }]}>
                    {signal.source?.display_name ?? 'Unknown'} · {timeAgo(signal.received_at)}
                  </Text>
                </View>
                <View style={[
                  s.statusBadge,
                  { backgroundColor: isParsed ? colors.successSurface : colors.dangerSurface }
                ]}>
                  <Text style={[s.statusText, { color: isParsed ? colors.tradeProfit : colors.tradeLoss }]}>
                    {isParsed ? 'Parsed' : signal.status === 'rejected' ? 'Rejected' : 'Pending'}
                  </Text>
                </View>
              </View>
            );
          })}
        </>
      )}
    </Page>
  );
}

const s = StyleSheet.create({
  summaryCard: { padding: 20, borderWidth: 1, borderRadius: 16, marginBottom: 24 },
  label: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1 },
  total: { fontFamily: 'Inter_800ExtraBold', fontSize: 32, letterSpacing: -1, marginTop: 6 },
  copy: { fontFamily: 'Inter_400Regular', fontSize: 12, marginTop: 4 },
  divider: { height: 1, marginVertical: 14 },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontFamily: 'Inter_700Bold', fontSize: 20 },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, marginTop: 3 },
  statDivider: { width: 1, height: 32, marginHorizontal: 12 },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 17, letterSpacing: -0.3, marginBottom: 12 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 13,
    borderBottomWidth: 1,
  },
  sideTag: { width: 46, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  sideText: { fontFamily: 'Inter_800ExtraBold', fontSize: 9, letterSpacing: 0.4 },
  symbol: { fontFamily: 'Inter_700Bold', fontSize: 14, letterSpacing: -0.2 },
  meta: { fontFamily: 'Inter_500Medium', fontSize: 11, marginTop: 3 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  statusText: { fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 0.3 },
  empty: { alignItems: 'center', paddingTop: 56, paddingHorizontal: 28 },
  icon: { width: 62, height: 62, borderRadius: 21, justifyContent: 'center', alignItems: 'center' },
  emptyTitle: { fontFamily: 'Inter_700Bold', fontSize: 18, marginTop: 18 },
  emptyCopy: { fontFamily: 'Inter_400Regular', textAlign: 'center', lineHeight: 19, fontSize: 13, marginTop: 7 },
});
