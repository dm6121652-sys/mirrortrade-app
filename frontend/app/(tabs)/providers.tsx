import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Card, Page } from '@/components/layout';
import { ScreenTitle, ThemeToggle } from '@/components/ui';
import { signalsApi, SignalSource } from '@/api/signals';
import { useTheme } from '@/context/ThemeContext';
import { router } from 'expo-router';

const CHANNEL_COLORS = ['#00D4AA', '#7C5CFF', '#0B8CFF', '#FF6B35', '#E040FB', '#00BCD4'];

export default function Providers() {
  const { colors } = useTheme();
  const [sources, setSources] = useState<SignalSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    signalsApi.getSources()
      .then(setSources)
      .catch(() => setError('Failed to load providers'))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <Page>
      <ScreenTitle eyebrow="Your network" title="Providers" action={<ThemeToggle />} />

      <Pressable
        onPress={() => router.push('/onboarding')}
        style={({ pressed }) => [
          s.discoverBtn,
          { backgroundColor: colors.cyan },
          pressed && { opacity: 0.85 },
        ]}
      >
        <Ionicons name="add" size={18} color="#fff" />
        <Text style={s.discoverBtnText}>Connect a channel</Text>
      </Pressable>

      {isLoading ? (
        <ActivityIndicator color={colors.cyan} style={{ marginTop: 40 }} />
      ) : error ? (
        <View style={[s.empty, { borderColor: colors.border, backgroundColor: colors.elevated }]}>
          <Ionicons name="cloud-offline-outline" size={26} color={colors.tradeLoss} />
          <Text style={[s.emptyTitle, { color: colors.text }]}>Could not load providers</Text>
          <Text style={[s.emptyCopy, { color: colors.muted }]}>{error}</Text>
        </View>
      ) : sources.length === 0 ? (
        <View style={[s.empty, { borderColor: colors.border, backgroundColor: colors.elevated }]}>
          <Ionicons name="telescope-outline" size={32} color={colors.cyan} />
          <Text style={[s.emptyTitle, { color: colors.text }]}>No channels connected</Text>
          <Text style={[s.emptyCopy, { color: colors.muted }]}>
            Connect a Telegram channel to start receiving trading signals automatically.
          </Text>
        </View>
      ) : (
        <>
          <Text style={[s.subhead, { color: colors.subtle }]}>
            FOLLOWING · {sources.length}
          </Text>
          {sources.map((source, i) => (
            <ProviderCard
              key={source.id}
              source={source}
              color={CHANNEL_COLORS[i % CHANNEL_COLORS.length]}
            />
          ))}
        </>
      )}
    </Page>
  );
}

function ProviderCard({ source, color }: { source: SignalSource; color: string }) {
  const { colors } = useTheme();
  const initials = source.display_name
    .replace(/[@_\-]/g, ' ')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

  return (
    <Card style={[s.card, { backgroundColor: colors.elevated, borderColor: colors.border }]}>
      <View style={s.top}>
        <View style={[s.avatar, { backgroundColor: color }]}>
          <Text style={[s.initials, { color: '#fff' }]}>{initials || '?'}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[s.name, { color: colors.text }]}>{source.display_name}</Text>
          <Text style={[s.channelId, { color: colors.subtle }]}>
            {source.platform === 'telegram' ? '📡 Telegram' : source.platform} · {source.external_chat_id}
          </Text>
        </View>
        <View style={[
          s.statusBadge,
          { backgroundColor: source.is_active ? colors.successSurface : colors.elevated }
        ]}>
          <View style={[s.dot, { backgroundColor: source.is_active ? colors.tradeProfit : colors.muted }]} />
          <Text style={[s.statusText, { color: source.is_active ? colors.tradeProfit : colors.muted }]}>
            {source.is_active ? 'LIVE' : 'PAUSED'}
          </Text>
        </View>
      </View>

      <View style={[s.metrics, { borderTopColor: colors.border }]}>
        <View style={s.metric}>
          <Text style={[s.metricValue, { color: colors.text }]}>{source.signal_count ?? 0}</Text>
          <Text style={[s.metricLabel, { color: colors.subtle }]}>Signals</Text>
        </View>
        <View style={s.metric}>
          <Text style={[s.metricValue, { color: source.is_trusted ? colors.tradeProfit : colors.muted }]}>
            {source.is_trusted ? '✓ Trusted' : 'Unverified'}
          </Text>
          <Text style={[s.metricLabel, { color: colors.subtle }]}>Trust Level</Text>
        </View>
        <View style={s.metric}>
          <Text style={[s.metricValue, { color: colors.text }]}>
            {new Date(source.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
          </Text>
          <Text style={[s.metricLabel, { color: colors.subtle }]}>Connected</Text>
        </View>
      </View>
    </Card>
  );
}

const s = StyleSheet.create({
  discoverBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 46,
    borderRadius: 12,
    marginBottom: 24,
  },
  discoverBtnText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: '#fff',
  },
  subhead: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    letterSpacing: 1,
    marginBottom: 12,
  },
  card: { marginBottom: 12, padding: 16, borderWidth: 1, borderRadius: 16 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  initials: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  name: { fontFamily: 'Inter_700Bold', fontSize: 15 },
  channelId: { fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 2 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 999,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 0.8 },
  metrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    borderTopWidth: 1,
    paddingTop: 14,
  },
  metric: { alignItems: 'center', flex: 1 },
  metricValue: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  metricLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, marginTop: 3 },
  empty: {
    minHeight: 200,
    borderWidth: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
    marginTop: 12,
  },
  emptyTitle: { fontFamily: 'Inter_700Bold', fontSize: 18, marginTop: 14 },
  emptyCopy: { fontFamily: 'Inter_400Regular', fontSize: 13, textAlign: 'center', marginTop: 6, lineHeight: 19 },
});
