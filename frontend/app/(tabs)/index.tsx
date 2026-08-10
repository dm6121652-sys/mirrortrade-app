import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { Image, Pressable, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { Page, Card } from '@/components/layout';
import { IconButton, Pill, ScreenTitle } from '@/components/ui';
import { useTheme } from '@/context/ThemeContext';
import { space } from '@/theme';
import { brokerApi } from '@/api/broker';
import { signalsApi, SignalRecord } from '@/api/signals';

export default function Dashboard() {
  const { colors, theme, toggleTheme } = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);
  const [metrics, setMetrics] = useState<{ balance: number; currency: string; openExposure: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [recentSignals, setRecentSignals] = useState<SignalRecord[]>([]);

  const fetchMetrics = async () => {
    try {
      const data = await brokerApi.getMetrics();
      setMetrics(data);
    } catch (error) {
      console.warn('Failed to fetch metrics', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSignals = async () => {
    try {
      const data = await signalsApi.getSignals({ limit: 3 });
      setRecentSignals(data);
    } catch (e) {
      console.warn('Failed to fetch signals', e);
    }
  };

  useEffect(() => {
    fetchMetrics();
    fetchSignals();
    const interval = setInterval(() => { fetchMetrics(); fetchSignals(); }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Page>
      {/* Top Header */}
      <View style={s.top}>
        <IconButton
          icon={theme === 'dark' ? 'sunny-outline' : 'moon-outline'}
          onPress={toggleTheme}
        />
        <Image
          source={
            theme === 'light'
              ? require('../../assets/images/dashboard-logo-light.png')
              : require('../../assets/images/dashboard-logo-cropped.png')
          }
          style={s.dashboardLogo}
          resizeMode="contain"
        />
        <IconButton icon="notifications-outline" />
      </View>

      {/* Greeting Title */}
      <View style={{ zIndex: 10 }}>
        <ScreenTitle
          eyebrow="Overview"
          title="Good evening, Alex"
          action={
            <View style={{ position: 'relative' }}>
              <IconButton icon="ellipsis-horizontal" onPress={() => setMenuVisible(!menuVisible)} />
              {menuVisible && (
                <View style={[s.menuDropdown, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Pressable style={s.menuItem} onPress={() => setMenuVisible(false)}>
                    <Ionicons name="swap-horizontal" size={15} color={colors.text} />
                    <Text style={[s.menuItemText, { color: colors.text }]}>Switch Account</Text>
                  </Pressable>
                  <Pressable style={s.menuItem} onPress={() => setMenuVisible(false)}>
                    <Ionicons name="refresh-outline" size={15} color={colors.text} />
                    <Text style={[s.menuItemText, { color: colors.text }]}>Refresh Data</Text>
                  </Pressable>
                  <Pressable style={s.menuItem} onPress={() => { setMenuVisible(false); router.push('/approval'); }}>
                    <Ionicons name="shield-outline" size={15} color={colors.text} />
                    <Text style={[s.menuItemText, { color: colors.text }]}>Risk Settings</Text>
                  </Pressable>
                </View>
              )}
            </View>
          }
        />
      </View>

      {/* Account overview */}
      <Card style={[s.balance, { backgroundColor: colors.elevated, borderColor: colors.card }]}>
        <View style={s.accountHeader}>
          <View>
            <Text style={[s.label, { color: colors.subtle }]}>PORTFOLIO VALUE</Text>
            <Text style={[s.accountName, { color: colors.muted }]}>Deriv Demo · USD account</Text>
          </View>
          <View style={[s.liveStatus, { backgroundColor: colors.successSurface }]}>
            <View style={[s.liveDot, { backgroundColor: colors.tradeProfit }]} />
            <Text style={[s.liveStatusText, { color: colors.tradeProfit }]}>LIVE</Text>
          </View>
        </View>

        {isLoading ? (
          <ActivityIndicator color={colors.cyan} style={{ alignSelf: 'flex-start', marginTop: 16, marginBottom: 8 }} />
        ) : (
          <Text style={[s.money, { color: colors.text }]}>
            {metrics?.currency === 'USD' ? '$' : metrics?.currency || '$'}{metrics?.balance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
          </Text>
        )}

        <View style={[s.performanceRow, { backgroundColor: colors.successSurface }]}>
          <View style={s.performanceIcon}>
            <Ionicons name="trending-up" size={17} color={colors.tradeProfit} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[s.performanceLabel, { color: colors.muted }]}>TODAY'S PERFORMANCE</Text>
            <Text style={[s.pnl, { color: colors.tradeProfit }]}>+$1,240.50 <Text style={s.pnlPercentage}>(+11.06%)</Text></Text>
          </View>
          <Text style={[s.marketState, { color: colors.tradeProfit }]}>On track</Text>
        </View>

        <View style={[s.metricsRow, { borderColor: colors.border }]}>
          <View style={s.metric}>
            <Text style={[s.metricLabel, { color: colors.subtle }]}>Available to trade</Text>
            <Text style={[s.metricValue, { color: colors.text }]}>
              ${isLoading ? '...' : (metrics ? Math.max(0, metrics.balance - metrics.openExposure).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00')}
            </Text>
          </View>
          <View style={[s.metricDivider, { backgroundColor: colors.border }]} />
          <View style={s.metric}>
            <Text style={[s.metricLabel, { color: colors.subtle }]}>Open exposure</Text>
            <Text style={[s.metricValue, { color: colors.text }]}>
              ${isLoading ? '...' : (metrics?.openExposure?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00')}
            </Text>
          </View>
        </View>

        <View style={s.riskLine}>
          <View style={s.riskLineHeader}>
            <Text style={[s.riskLabel, { color: colors.muted }]}>Daily loss guard</Text>
            <Text style={[s.riskValue, { color: colors.text }]}>$84.20 <Text style={{ color: colors.subtle }}>of $500</Text></Text>
          </View>
          <View style={[s.riskTrack, { backgroundColor: colors.card }]}>
            <View style={[s.riskFill, { backgroundColor: colors.cyan }]} />
          </View>
        </View>
      </Card>

      {/* Professional Stats / Widgets */}
      <View style={s.stats}>
        <View style={[s.statCard, { backgroundColor: colors.elevated, borderColor: colors.border }]}>
          <View style={s.statHeader}>
            <Ionicons name="server-outline" size={14} color={colors.cyan} />
            <Text style={[s.statLabel, { color: colors.muted }]}>BROKER</Text>
          </View>
          <Text style={[s.statValue, { color: colors.text }]}>Deriv Account</Text>
          <View style={s.statusRow}>
            <View style={[s.statusDot, { backgroundColor: colors.tradeProfit }]} />
            <Text style={[s.statusText, { color: colors.subtle }]}>Operational</Text>
          </View>
        </View>

        <View style={[s.statCard, { backgroundColor: colors.elevated, borderColor: colors.border }]}>
          <View style={s.statHeader}>
            <Ionicons name="shield-checkmark-outline" size={14} color={colors.cyan} />
            <Text style={[s.statLabel, { color: colors.muted }]}>RISK SHIELD</Text>
          </View>
          <Text style={[s.statValue, { color: colors.text }]}>Conservative</Text>
          <Text style={[s.statusTextSubtle, { color: colors.muted }]}>Max Drawdown: 10%</Text>
        </View>
      </View>

      {/* Needs Attention Alert */}
      <View style={s.section}>
        <Text style={[s.sectionTitle, { color: colors.text }]}>Needs your attention</Text>
        <Pressable
          onPress={() => router.push('/approval')}
          style={({ pressed }) => [
            s.approval,
            { borderColor: colors.amber },
            pressed && { opacity: 0.8 },
          ]}
        >
          <View style={s.approvalIcon}>
            <Ionicons name="time-outline" size={20} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={[s.approvalTitle, { color: colors.text }]}>1 signal awaiting approval</Text>
            <Text style={[s.approvalCopy, { color: colors.muted }]}>Atlas Signals · XAU/USD BUY</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.amber} />
        </Pressable>
      </View>

      {/* Live Trade Feed */}
      <View style={s.section}>
        <View style={s.sectionHeader}>
          <Text style={[s.sectionTitle, { color: colors.text }]}>Live signal feed</Text>
          <Pressable onPress={() => router.push('/feed')}>
            <Text style={[s.link, { color: colors.cyan }]}>View all</Text>
          </Pressable>
        </View>

        {recentSignals.length === 0 ? (
          <View style={[s.emptyFeed, { backgroundColor: colors.elevated, borderColor: colors.border }]}>
            <Ionicons name="radio-outline" size={22} color={colors.subtle} />
            <Text style={[s.emptyFeedText, { color: colors.muted }]}>
              No signals yet. Connect a Telegram channel to start.
            </Text>
          </View>
        ) : (
          recentSignals.map((signal) => {
            const payload = signal.parsed_payload;
            const action = payload?.action ?? '—';
            const symbol = payload?.symbol ?? 'Unknown';
            const provider = signal.source?.display_name ?? 'Unknown';
            const isParsed = signal.status === 'parsed';
            const diff = Date.now() - new Date(signal.received_at).getTime();
            const mins = Math.floor(diff / 60000);
            const timeStr = mins < 1 ? 'Just now' : mins < 60 ? `${mins}m ago` : `${Math.floor(mins / 60)}h ago`;
            return (
              <View key={signal.id} style={[s.trade, { borderBottomColor: colors.card }]}>
                <View
                  style={[
                    s.side,
                    {
                      backgroundColor:
                        action === 'BUY' ? colors.successSurface : colors.dangerSurface,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: action === 'BUY' ? colors.tradeProfit : colors.tradeLoss,
                      fontWeight: '800',
                      fontSize: 11,
                    }}
                  >
                    {action}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[s.symbol, { color: colors.text }]}>{symbol}</Text>
                  <Text style={[s.tradeMeta, { color: colors.subtle }]}>
                    From {provider} · {timeStr}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 4 }}>
                  <View style={[s.statusPill, { backgroundColor: isParsed ? colors.successSurface : colors.dangerSurface }]}>
                    <Text style={{ color: isParsed ? colors.tradeProfit : colors.tradeLoss, fontFamily: 'Inter_700Bold', fontSize: 10 }}>
                      {isParsed ? 'Parsed' : 'Rejected'}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </View>
    </Page>
  );
}

const s = StyleSheet.create({
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: space.lg,
  },
  dashboardLogo: {
    position: 'absolute',
    left: '50%',
    marginLeft: -19,
    width: 38,
    height: 38,
  },
  balance: {
    padding: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderRadius: 16,
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  accountName: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    marginTop: 4,
  },
  liveStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 999,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  liveStatusText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    letterSpacing: 0.8,
  },
  label: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  money: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 36,
    letterSpacing: -1.5,
    marginTop: 8,
  },
  performanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 12,
    padding: 12,
    marginTop: 18,
  },
  performanceIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#00E67616',
    justifyContent: 'center',
    alignItems: 'center',
  },
  performanceLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    letterSpacing: 0.8,
  },
  marketState: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
  },
  pnl: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    marginTop: 3,
  },
  pnlPercentage: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
  },
  subtle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  metric: {
    flex: 1,
    gap: 2,
  },
  metricLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  metricValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    letterSpacing: -0.3,
  },
  riskLine: {
    marginTop: 18,
  },
  riskLineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  riskLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
  },
  riskValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
  },
  riskTrack: {
    height: 5,
    borderRadius: 999,
    overflow: 'hidden',
  },
  riskFill: {
    width: '17%',
    height: '100%',
    borderRadius: 999,
  },
  metricDivider: {
    width: 1,
    height: 24,
    marginHorizontal: 12,
  },
  stats: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 6,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    letterSpacing: 0.8,
  },
  statValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 15,
    letterSpacing: -0.2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    letterSpacing: 0.1,
  },
  statusTextSubtle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    marginTop: 2,
  },
  section: {
    marginTop: 28,
  },
  sectionTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    letterSpacing: -0.4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  link: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    letterSpacing: 0.1,
  },
  approval: {
    backgroundColor: '#FFB80014',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
  },
  approvalIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FFB800',
    alignItems: 'center',
    justifyContent: 'center',
  },
  approvalTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    letterSpacing: -0.1,
  },
  approvalCopy: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    marginTop: 3,
  },
  trade: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  side: {
    width: 42,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  symbol: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    letterSpacing: -0.2,
  },
  tradeMeta: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    marginTop: 4,
  },
  tradePnl: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    letterSpacing: -0.1,
  },
  menuDropdown: {
    position: 'absolute',
    top: 50,
    right: 0,
    width: 170,
    borderRadius: 12,
    borderWidth: 1,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  menuItemText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    letterSpacing: 0.1,
  },
  emptyFeed: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
  },
  emptyFeedText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
});

