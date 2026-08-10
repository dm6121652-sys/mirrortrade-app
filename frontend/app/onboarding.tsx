import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { onboardingApi } from '@/api/onboarding';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { space } from '@/theme';

type Goal = 'growth' | 'balanced' | 'passive';

export default function Onboarding() {
  const { colors, theme, toggleTheme } = useTheme();

  // Onboarding states
  const [step, setStep] = useState(0); // 0: Goal, 1: Broker, 2-4: Signals, 5: Risk Shield
  const [goal, setGoal] = useState<Goal>('growth');
  const [channelInput, setChannelInput] = useState('');
  const [isMember, setIsMember] = useState(false);
  const [connectedChannels, setConnectedChannels] = useState<string[]>([]);
  const [riskDrawdown, setRiskDrawdown] = useState(10);
  const [riskDailyLoss, setRiskDailyLoss] = useState(5);
  const [derivToken, setDerivToken] = useState('');
  const [isFinishing, setIsFinishing] = useState(false);
  const [finishError, setFinishError] = useState('');

  const activeChannelName = channelInput.trim() || 'Habbyforex Signals';

  const handleNextStep = () => {
    setStep((prev) => prev + 1);
  };

  const handleBackStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleConnectChannel = () => {
    if (!isMember) return;
    setConnectedChannels((prev) => [...prev, activeChannelName]);
    setStep(4); // Go to Connected screen
  };

  const handleAddMore = () => {
    setChannelInput('');
    setIsMember(false);
    setStep(2); // Go back to Connect Telegram screen
  };

  return (
    <View style={[s.root, { backgroundColor: colors.base }]}>
      <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Top Progress Indicator */}
          <View style={s.header}>
            <View style={s.headerRow}>
              <Text style={[s.stepIndicator, { color: colors.muted }]}>
                Step {step === 5 ? 4 : step >= 3 ? 3 : step + 1} of 4
              </Text>
              <Pressable
                onPress={toggleTheme}
                style={[s.themeSwitch, { backgroundColor: colors.elevated, borderColor: colors.border }]}
              >
                <Ionicons
                  name={theme === 'light' ? 'moon-outline' : 'sunny-outline'}
                  size={15}
                  color={colors.text}
                />
                <Text style={[s.themeSwitchText, { color: colors.text }]}>
                  {theme === 'light' ? 'Light' : 'Dark'}
                </Text>
              </Pressable>
            </View>
            <View style={[s.progressBar, { backgroundColor: colors.elevated }]}>
              <View
                style={[
                  s.progressFill,
                  {
                    backgroundColor: colors.cyan,
                    width: `${((step === 5 ? 4 : step >= 3 ? 3 : step + 1) / 4) * 100}%`,
                  },
                ]}
              />
            </View>
          </View>

          <ScrollView
            contentContainerStyle={s.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* ── STEP 0: GOAL SELECTION ──────────────────────── */}
            {step === 0 && (
              <View style={s.container}>
                <View style={s.iconTitleContainer}>
                  <View style={[s.stepIconBox, { backgroundColor: colors.elevated }]}>
                    <Ionicons name="compass-outline" size={28} color={colors.cyan} />
                  </View>
                  <Text style={[s.heading, { color: colors.text }]}>What is your trading goal?</Text>
                  <Text style={[s.subheading, { color: colors.muted }]}>
                    Trallo will configure your automated execution limits based on your preference.
                  </Text>
                </View>

                <View style={s.goalOptions}>
                  <Pressable
                    style={[
                      s.optionCard,
                      { backgroundColor: colors.elevated, borderColor: colors.border },
                      goal === 'growth' && { borderColor: colors.cyan, backgroundColor: 'transparent' },
                    ]}
                    onPress={() => setGoal('growth')}
                  >
                    <Ionicons
                      name="trending-up-outline"
                      size={22}
                      color={goal === 'growth' ? colors.cyan : colors.subtle}
                    />
                    <View style={s.optionTextContainer}>
                      <Text style={[s.optionTitle, { color: colors.text }]}>Capital Growth</Text>
                      <Text style={[s.optionDesc, { color: colors.muted }]}>
                        Maximize return opportunities with standard risk margins.
                      </Text>
                    </View>
                  </Pressable>

                  <Pressable
                    style={[
                      s.optionCard,
                      { backgroundColor: colors.elevated, borderColor: colors.border },
                      goal === 'balanced' && { borderColor: colors.cyan, backgroundColor: 'transparent' },
                    ]}
                    onPress={() => setGoal('balanced')}
                  >
                    <Ionicons
                      name="scale-outline"
                      size={22}
                      color={goal === 'balanced' ? colors.cyan : colors.subtle}
                    />
                    <View style={s.optionTextContainer}>
                      <Text style={[s.optionTitle, { color: colors.text }]}>Balanced</Text>
                      <Text style={[s.optionDesc, { color: colors.muted }]}>
                        Steady, moderate trading limits prioritizing safety and performance.
                      </Text>
                    </View>
                  </Pressable>

                  <Pressable
                    style={[
                      s.optionCard,
                      { backgroundColor: colors.elevated, borderColor: colors.border },
                      goal === 'passive' && { borderColor: colors.cyan, backgroundColor: 'transparent' },
                    ]}
                    onPress={() => setGoal('passive')}
                  >
                    <Ionicons
                      name="shield-checkmark-outline"
                      size={22}
                      color={goal === 'passive' ? colors.cyan : colors.subtle}
                    />
                    <View style={s.optionTextContainer}>
                      <Text style={[s.optionTitle, { color: colors.text }]}>Conservative</Text>
                      <Text style={[s.optionDesc, { color: colors.muted }]}>
                        Focus on capital preservation with strict minimal exposure.
                      </Text>
                    </View>
                  </Pressable>
                </View>

                <Pressable
                  onPress={handleNextStep}
                  style={({ pressed }) => [
                    s.primaryBtn,
                    { backgroundColor: colors.cyan, marginTop: 24 },
                    pressed && { opacity: 0.85 },
                  ]}
                >
                  <Text style={[s.primaryBtnText, { color: colors.base }]}>Continue</Text>
                </Pressable>
              </View>
            )}

            {/* ── STEP 1: CONNECT TELEGRAM ────────────────────── */}
            {step === 1 && (
              <View style={s.container}>
                <View style={s.iconTitleContainer}>
                  <View style={[s.stepIconBox, { backgroundColor: colors.elevated }]}>
                    <Ionicons name="wallet-outline" size={28} color={colors.cyan} />
                  </View>
                  <Text style={[s.heading, { color: colors.text }]}>Connect your broker</Text>
                  <Text style={[s.subheading, { color: colors.muted }]}>Link your Deriv account so MirrorTrade can place and monitor your copied demo trades.</Text>
                </View>

                <View style={[s.brokerCard, { backgroundColor: colors.elevated, borderColor: colors.border }]}>
                  <View style={s.brokerCardHeader}>
                    <View style={[s.derivMark, { backgroundColor: colors.cyan }]}><Text style={[s.derivMarkText, { color: colors.base }]}>D</Text></View>
                    <View style={{ flex: 1 }}><Text style={[s.brokerName, { color: colors.text }]}>Deriv</Text><Text style={[s.brokerMeta, { color: colors.muted }]}>Forex & Crypto · Demo account</Text></View>
                    <View style={[s.recommendedBadge, { backgroundColor: colors.successSurface }]}><Text style={[s.recommendedText, { color: colors.tradeProfit }]}>SUPPORTED</Text></View>
                  </View>
                  <View style={[s.divider, { backgroundColor: colors.border }]} />
                  <Text style={[s.inputLabel, { color: colors.muted }]}>Deriv API token</Text>
                  <TextInput style={[s.inputField, { color: colors.text, borderColor: colors.border }]} value={derivToken} onChangeText={setDerivToken} placeholder="Paste your demo API token" placeholderTextColor={colors.disabled} autoCapitalize="none" autoCorrect={false} secureTextEntry />
                  <View style={s.brokerHint}><Ionicons name="lock-closed-outline" size={14} color={colors.cyan} /><Text style={[s.brokerHintText, { color: colors.muted }]}>Your token is used only to connect your account. It is never saved on this device.</Text></View>
                </View>

                <View style={s.btnRow}>
                  <Pressable onPress={handleBackStep} style={[s.secondaryBtn, { borderColor: colors.border }]}><Text style={[s.secondaryBtnText, { color: colors.subtle }]}>Back</Text></Pressable>
                  <Pressable onPress={handleNextStep} disabled={!derivToken.trim()} style={({ pressed }) => [s.primaryBtn, { backgroundColor: colors.cyan, flex: 1.4 }, (!derivToken.trim() || pressed) && { opacity: .65 }]}><Text style={[s.primaryBtnText, { color: colors.base }]}>Connect Deriv Demo</Text></Pressable>
                </View>
                <Pressable onPress={handleNextStep} style={s.laterLink}><Text style={[s.laterLinkText, { color: colors.subtle }]}>I’ll connect my broker later</Text></Pressable>
              </View>
            )}

            {step === 2 && (
              <View style={s.container}>
                <View style={s.iconTitleContainer}>
                  <Text style={[s.headingLarge, { color: colors.text }]}>
                    🎯 Connect Trading Signals
                  </Text>
                  <Text style={[s.subheading, { color: colors.muted }]}>
                    Get signals from Telegram channels and execute trades automatically.
                  </Text>
                </View>

                <View style={[s.inputWrapper, { borderColor: colors.border }]}>
                  <Text style={[s.inputLabel, { color: colors.muted }]}>Enter channel or group name</Text>
                  <TextInput
                    style={[s.inputField, { color: colors.text, borderColor: colors.border }]}
                    value={channelInput}
                    onChangeText={setChannelInput}
                    placeholder="@habbyforex_signals"
                    placeholderTextColor={colors.disabled}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <Text style={[s.helperHint, { color: colors.muted }]}>
                    or: forex-signals-group{'\n'}or: -1001234567890 (group ID)
                  </Text>

                  <View style={[s.infoBox, { backgroundColor: colors.elevated, borderColor: colors.border }]}>
                    <Text style={[s.infoBoxTitle, { color: colors.text }]}>ℹ️ How to find your group ID:</Text>
                    <Text style={[s.infoBoxBody, { color: colors.muted }]}>
                      • Go to Telegram{'\n'}
                      • Open the channel/group{'\n'}
                      • Right-click → Copy Group Link{'\n'}
                      • Find number after "c/"
                    </Text>
                  </View>
                </View>

                <View style={s.btnRow}>
                  <Pressable
                    onPress={() => setStep(5)} // Skip to Risk Shield
                    style={({ pressed }) => [
                      s.secondaryBtn,
                      { borderColor: colors.border },
                      pressed && { opacity: 0.7 },
                    ]}
                  >
                    <Text style={[s.secondaryBtnText, { color: colors.subtle }]}>Skip for Now</Text>
                  </Pressable>

                  <Pressable
                    onPress={handleNextStep}
                    disabled={!channelInput.trim()}
                    style={({ pressed }) => [
                      s.primaryBtn,
                      { backgroundColor: colors.cyan, flex: 1.3 },
                      (!channelInput.trim() || pressed) && { opacity: 0.7 },
                    ]}
                  >
                    <Text style={[s.primaryBtnText, { color: colors.base }]}>Continue</Text>
                  </Pressable>
                </View>
              </View>
            )}

            {/* ── STEP 2: VERIFY CHANNEL ──────────────────────── */}
            {step === 3 && (
              <View style={s.container}>
                <View style={s.iconTitleContainer}>
                  <View style={[s.stepIconBox, { backgroundColor: colors.successSurface, borderRadius: 12 }]}>
                    <Ionicons name="checkmark-circle-outline" size={24} color={colors.tradeProfit} />
                  </View>
                  <Text style={[s.heading, { color: colors.text, marginTop: 4 }]}>
                    Channel Found!
                  </Text>
                  <Text style={[s.subheading, { color: colors.muted }]}>
                    We successfully located the Telegram source. Verify it matches below.
                  </Text>
                </View>

                {/* Premium Channel Identity Card */}
                <View style={[s.verifyBox, { backgroundColor: colors.elevated, borderColor: colors.border }]}>
                  
                  <View style={s.channelHeader}>
                    {/* Circular Letter Avatar */}
                    <View style={[s.avatarCircle, { backgroundColor: colors.card }]}>
                      <Text style={[s.avatarLetter, { color: colors.text }]}>
                        {activeChannelName.replace(/[@_-]/g, '').slice(0, 1).toUpperCase() || 'T'}
                      </Text>
                      <View style={[s.avatarBadge, { backgroundColor: colors.cyan }]}>
                        <Ionicons name="paper-plane-outline" size={10} color="#FFFFFF" />
                      </View>
                    </View>
                    
                    <View style={s.channelHeaderInfo}>
                      <Text style={[s.channelNameLarge, { color: colors.text }]} numberOfLines={1}>
                        {activeChannelName}
                      </Text>
                      <View style={s.pillRow}>
                        <View style={[s.verifiedPill, { backgroundColor: 'rgba(31,6,255,0.1)' }]}>
                          <Ionicons name="shield-checkmark" size={10} color={colors.cyan} />
                          <Text style={[s.verifiedPillText, { color: colors.cyan }]}>Verified Signal Source</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Horizontal Metrics Grid */}
                  <View style={[s.verifyMetricsRow, { borderTopColor: colors.border, borderBottomColor: colors.border }]}>
                    <View style={s.verifyMetric}>
                      <Text style={[s.verifyMetricVal, { color: colors.text }]}>~500</Text>
                      <Text style={[s.verifyMetricLbl, { color: colors.muted }]}>MEMBERS</Text>
                    </View>
                    <View style={[s.verifyMetricDivider, { backgroundColor: colors.border }]} />
                    <View style={s.verifyMetric}>
                      <Text style={[s.verifyMetricVal, { color: colors.text }]}>Public</Text>
                      <Text style={[s.verifyMetricLbl, { color: colors.muted }]}>CHANNEL TYPE</Text>
                    </View>
                  </View>

                  {/* Premium Glow Checkbox Card */}
                  <Pressable
                    style={[
                      s.checkboxCard,
                      { backgroundColor: colors.card, borderColor: colors.border },
                      isMember && { borderColor: colors.cyan }
                    ]}
                    onPress={() => setIsMember(!isMember)}
                  >
                    <View
                      style={[
                        s.checkboxSquare,
                        { borderColor: colors.border },
                        isMember && { backgroundColor: colors.cyan, borderColor: colors.cyan }
                      ]}
                    >
                      {isMember && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[s.checkboxCardTitle, { color: colors.text }]}>
                        I am a member of this channel
                      </Text>
                      <Text style={[s.checkboxCardDesc, { color: colors.muted }]}>
                        Only active members can auto-copy trades from this channel.
                      </Text>
                    </View>
                  </Pressable>

                  {/* Info Notice Box */}
                  <View style={s.whyAskBox}>
                    <Ionicons name="information-circle-outline" size={14} color={colors.subtle} style={{ marginTop: 1 }} />
                    <Text style={[s.whyAskText, { color: colors.muted }]}>
                      This is required to bind your Trallo ingestion engine to this source feed.
                    </Text>
                  </View>
                </View>

                {/* CTA Buttons */}
                <View style={s.btnRow}>
                  <Pressable
                    onPress={handleBackStep}
                    style={({ pressed }) => [
                      s.secondaryBtn,
                      { borderColor: colors.border, flex: 1 },
                      pressed && { opacity: 0.7 },
                    ]}
                  >
                    <Text style={[s.secondaryBtnText, { color: colors.subtle }]}>Back</Text>
                  </Pressable>

                  <Pressable
                    onPress={handleConnectChannel}
                    disabled={!isMember}
                    style={({ pressed }) => [
                      s.primaryBtn,
                      { backgroundColor: colors.cyan, flex: 2.2 },
                      (!isMember || pressed) && { opacity: 0.7 },
                    ]}
                  >
                    <Text style={[s.primaryBtnText, { color: colors.base }]}>Connect Channel</Text>
                  </Pressable>
                </View>
              </View>
            )}

            {/* ── STEP 3: CONNECTED SUCCESS ──────────────────── */}
            {step === 4 && (
              <View style={s.container}>
                <View style={s.iconTitleContainer}>
                  <Text style={[s.headingLarge, { color: colors.text }]}>
                    ✅ Connected Successfully!
                  </Text>
                </View>

                <View style={[s.successBox, { backgroundColor: colors.elevated, borderColor: colors.border }]}>
                  <View style={s.successHeader}>
                    <Text style={[s.successChannelName, { color: colors.text }]}>
                      📺 {activeChannelName}
                    </Text>
                    <View style={[s.statusBadge, { backgroundColor: colors.successSurface }]}>
                      <View style={[s.statusDot, { backgroundColor: colors.tradeProfit }]} />
                      <Text style={[s.statusText, { color: colors.tradeProfit }]}>ACTIVE</Text>
                    </View>
                  </View>

                  <View style={[s.divider, { backgroundColor: colors.border }]} />

                  <Text style={[s.sectionSubtitle, { color: colors.text }]}>What happens next:</Text>
                  <View style={s.bulletRow}>
                    <Ionicons name="checkmark-circle-outline" size={16} color={colors.tradeProfit} />
                    <Text style={[s.bulletText, { color: colors.muted }]}>
                      Signals from this channel will arrive in real-time
                    </Text>
                  </View>
                  <View style={s.bulletRow}>
                    <Ionicons name="checkmark-circle-outline" size={16} color={colors.tradeProfit} />
                    <Text style={[s.bulletText, { color: colors.muted }]}>
                      You'll need to set your trading preferences (risk, position size)
                    </Text>
                  </View>
                  <View style={s.bulletRow}>
                    <Ionicons name="checkmark-circle-outline" size={16} color={colors.tradeProfit} />
                    <Text style={[s.bulletText, { color: colors.muted }]}>
                      Signals will be automatically executed to your broker account
                    </Text>
                  </View>

                  <View style={[s.divider, { backgroundColor: colors.border }]} />

                  <Text style={[s.connectedHeader, { color: colors.text }]}>
                    Connected Channels ({connectedChannels.length}):
                  </Text>
                  {connectedChannels.map((ch, idx) => (
                    <View key={idx} style={s.connectedChannelRow}>
                      <Text style={[s.connectedChannelBullet, { color: colors.muted }]}>• {ch}</Text>
                      <Text style={{ color: colors.tradeProfit, fontSize: 12 }}> 🟢</Text>
                    </View>
                  ))}
                </View>

                <View style={s.btnRow}>
                  <Pressable
                    onPress={handleAddMore}
                    style={({ pressed }) => [
                      s.secondaryBtn,
                      { borderColor: colors.border },
                      pressed && { opacity: 0.7 },
                    ]}
                  >
                    <Text style={[s.secondaryBtnText, { color: colors.subtle }]}>Add More</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => setStep(5)} // Continue to Risk Shield
                    style={({ pressed }) => [
                      s.primaryBtn,
                      { backgroundColor: colors.cyan, flex: 1.3 },
                      pressed && { opacity: 0.85 },
                    ]}
                  >
                    <Text style={[s.primaryBtnText, { color: colors.base }]}>Continue to Setup</Text>
                  </Pressable>
                </View>
              </View>
            )}

            {/* ── STEP 4: RISK SHIELD ────────────────────────── */}
            {step === 5 && (
              <View style={s.container}>
                <View style={s.iconTitleContainer}>
                  <View style={[s.stepIconBox, { backgroundColor: colors.elevated }]}>
                    <Ionicons name="shield-checkmark-outline" size={28} color={colors.cyan} />
                  </View>
                  <Text style={[s.heading, { color: colors.text }]}>Setup Risk Shield</Text>
                  <Text style={[s.subheading, { color: colors.muted }]}>
                    Configure safety limits to protect your balance from unexpected drawdown events.
                  </Text>
                </View>

                <View style={s.slidersContainer}>
                  {/* Slider 1: Max Drawdown */}
                  <View style={[s.sliderCard, { backgroundColor: colors.elevated, borderColor: colors.border }]}>
                    <View style={s.sliderHeader}>
                      <Text style={[s.sliderTitle, { color: colors.text }]}>Max Drawdown Limit</Text>
                      <Text style={[s.sliderValText, { color: colors.cyan }]}>{riskDrawdown}%</Text>
                    </View>
                    <View style={s.adjustRow}>
                      <Pressable
                        style={[s.adjustBtn, { borderColor: colors.border }]}
                        onPress={() => setRiskDrawdown((prev) => Math.max(1, prev - 1))}
                      >
                        <Ionicons name="remove" size={18} color={colors.text} />
                      </Pressable>
                      <View style={[s.sliderVisualTrack, { backgroundColor: colors.border }]}>
                        <View style={[s.sliderVisualFill, { backgroundColor: colors.cyan, width: `${riskDrawdown * 4}%` }]} />
                      </View>
                      <Pressable
                        style={[s.adjustBtn, { borderColor: colors.border }]}
                        onPress={() => setRiskDrawdown((prev) => Math.min(25, prev + 1))}
                      >
                        <Ionicons name="add" size={18} color={colors.text} />
                      </Pressable>
                    </View>
                  </View>

                  {/* Slider 2: Max Daily Loss */}
                  <View style={[s.sliderCard, { backgroundColor: colors.elevated, borderColor: colors.border }]}>
                    <View style={s.sliderHeader}>
                      <Text style={[s.sliderTitle, { color: colors.text }]}>Max Daily Loss</Text>
                      <Text style={[s.sliderValText, { color: colors.cyan }]}>{riskDailyLoss}%</Text>
                    </View>
                    <View style={s.adjustRow}>
                      <Pressable
                        style={[s.adjustBtn, { borderColor: colors.border }]}
                        onPress={() => setRiskDailyLoss((prev) => Math.max(1, prev - 1))}
                      >
                        <Ionicons name="remove" size={18} color={colors.text} />
                      </Pressable>
                      <View style={[s.sliderVisualTrack, { backgroundColor: colors.border }]}>
                        <View style={[s.sliderVisualFill, { backgroundColor: colors.cyan, width: `${riskDailyLoss * 5}%` }]} />
                      </View>
                      <Pressable
                        style={[s.adjustBtn, { borderColor: colors.border }]}
                        onPress={() => setRiskDailyLoss((prev) => Math.min(20, prev + 1))}
                      >
                        <Ionicons name="add" size={18} color={colors.text} />
                      </Pressable>
                    </View>
                  </View>
                </View>

                <View style={{ gap: 8 }}>
                  {finishError !== '' && (
                    <Text style={{ color: colors.danger, fontFamily: 'Inter_500Medium', fontSize: 13, textAlign: 'center' }}>
                      {finishError}
                    </Text>
                  )}
                  <Pressable
                    disabled={isFinishing}
                    onPress={async () => {
                      setFinishError('');
                      setIsFinishing(true);
                      try {
                        await onboardingApi.complete({
                          maxRiskPerTrade: riskDrawdown,
                          maxDailyLoss: riskDailyLoss,
                        });
                        router.replace('/(tabs)');
                      } catch (e: any) {
                        setFinishError(e.response?.data?.message || 'Failed to save settings. Please try again.');
                      } finally {
                        setIsFinishing(false);
                      }
                    }}
                    style={({ pressed }) => [
                      s.primaryBtn,
                      { backgroundColor: colors.cyan, marginTop: 24 },
                      (pressed || isFinishing) && { opacity: 0.85 },
                    ]}
                  >
                    <Text style={[s.primaryBtnText, { color: colors.base }]}>
                      {isFinishing ? 'Saving...' : 'Finish Setup'}
                    </Text>
                  </Pressable>
                </View>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepIndicator: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    letterSpacing: 0.6,
  },
  themeSwitch: {
    minHeight: 32,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  themeSwitchText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  container: {
    gap: 24,
  },
  iconTitleContainer: {
    alignItems: 'flex-start',
    gap: 12,
  },
  stepIconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 26,
    letterSpacing: -0.6,
    lineHeight: 32,
  },
  headingLarge: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 28,
    letterSpacing: -0.8,
    lineHeight: 34,
  },
  subheading: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 21,
  },

  // Goal Options
  goalOptions: {
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 16,
  },
  optionTextContainer: {
    flex: 1,
    gap: 4,
  },
  optionTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    letterSpacing: -0.2,
  },
  optionDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 17,
  },

  // Telegram Connect
  inputWrapper: {
    gap: 12,
  },
  inputLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  inputField: {
    fontFamily: 'Inter_500Medium',
    height: 54,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    letterSpacing: 0.1,
    backgroundColor: 'transparent',
  },
  helperHint: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 18,
  },
  infoBox: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginTop: 8,
    gap: 6,
  },
  infoBoxTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },
  infoBoxBody: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    lineHeight: 18,
  },

  // Broker connection
  brokerCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 14,
  },
  brokerCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  derivMark: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  derivMarkText: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 21,
    letterSpacing: -0.8,
  },
  brokerName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    letterSpacing: -0.2,
  },
  brokerMeta: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    marginTop: 3,
  },
  recommendedBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  recommendedText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    letterSpacing: 0.6,
  },
  brokerHint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  brokerHintText: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    lineHeight: 16,
  },
  laterLink: {
    alignSelf: 'center',
    paddingVertical: 4,
  },
  laterLinkText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    textDecorationLine: 'underline',
  },

  // Verification Screen
  verifyBox: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    gap: 18,
  },
  channelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarLetter: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  avatarBadge: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  channelHeaderInfo: {
    flex: 1,
    gap: 6,
  },
  channelNameLarge: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    letterSpacing: -0.4,
  },
  pillRow: {
    flexDirection: 'row',
  },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  verifiedPillText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    letterSpacing: 0.2,
  },
  verifyMetricsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 14,
  },
  verifyMetric: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  verifyMetricDivider: {
    width: 1,
  },
  verifyMetricVal: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 18,
    letterSpacing: -0.3,
  },
  verifyMetricLbl: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    letterSpacing: 0.8,
  },
  checkboxCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  checkboxSquare: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    flexShrink: 0,
  },
  checkboxCardTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    letterSpacing: -0.1,
    marginBottom: 3,
  },
  checkboxCardDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 17,
  },
  whyAskBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  whyAskText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    lineHeight: 16,
    flex: 1,
  },
  divider: {
    height: 1,
  },

  // Success Screen
  successBox: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 14,
  },
  successHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  successChannelName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    letterSpacing: -0.3,
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    letterSpacing: 0.6,
  },
  sectionSubtitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingLeft: 4,
  },
  bulletText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    lineHeight: 19,
    flex: 1,
  },
  connectedHeader: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
  },
  connectedChannelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 4,
  },
  connectedChannelBullet: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
  },

  // Risk Shield Sliders
  slidersContainer: {
    gap: 16,
  },
  sliderCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 14,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sliderTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    letterSpacing: -0.1,
  },
  sliderValText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    letterSpacing: -0.3,
  },
  adjustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  adjustBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderVisualTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  sliderVisualFill: {
    height: '100%',
    borderRadius: 3,
  },

  // Global BTNs
  primaryBtn: {
    height: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 15,
    letterSpacing: 0.1,
  },
  secondaryBtn: {
    height: 54,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  secondaryBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    letterSpacing: 0.1,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
  },
});
