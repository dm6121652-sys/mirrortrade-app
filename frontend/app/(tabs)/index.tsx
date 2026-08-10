import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Page, Card } from '@/components/layout';
import { IconButton, Pill, ScreenTitle } from '@/components/ui';
import { trades } from '@/data/demo';
import { useTheme } from '@/context/ThemeContext';
import { space } from '@/theme';

export default function Dashboard() {
  const { colors, theme, toggleTheme } = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);

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

        <Text style={[s.money, { color: colors.text }]}>$12,450.80</Text>

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
            <Text style={[s.metricValue, { color: colors.text }]}>$8,240.00</Text>
          </View>
          <View style={[s.metricDivider, { backgroundColor: colors.border }]} />
          <View style={s.metric}>
            <Text style={[s.metricLabel, { color: colors.subtle }]}>Open exposure</Text>
            <Text style={[s.metricValue, { color: colors.text }]}>$2,980.40</Text>
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
          <Text style={[s.sectionTitle, { color: colors.text }]}>Live trade feed</Text>
          <Pressable onPress={() => router.push('/feed')}>
            <Text style={[s.link, { color: colors.cyan }]}>View all</Text>
          </Pressable>
        </View>

        {trades.slice(0, 2).map((t) => (
          <View key={t.id} style={[s.trade, { borderBottomColor: colors.card }]}>
            <View
              style={[
                s.side,
                {
                  backgroundColor:
                    t.side === 'BUY' ? colors.successSurface : colors.dangerSurface,
                },
              ]}
            >
              <Text
                style={{
                  color: t.side === 'BUY' ? colors.tradeProfit : colors.tradeLoss,
                  fontWeight: '800',
                  fontSize: 11,
                }}
              >
                {t.side}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[s.symbol, { color: colors.text }]}>{t.symbol}</Text>
              <Text style={[s.tradeMeta, { color: colors.subtle }]}> 
                From {t.provider} · {t.time}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end', gap: 4 }}>
              <Text
                style={[
                  s.tradePnl,
                  { color: t.pnl >= 0 ? colors.tradeProfit : colors.tradeLoss },
                ]}
              >
                {t.pnl >= 0 ? '+' : ''}${t.pnl.toFixed(2)}
              </Text>
              <Pill label={t.status} tone={t.pnl >= 0 ? 'green' : 'amber'} />
            </View>
          </View>
        ))}
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
});
