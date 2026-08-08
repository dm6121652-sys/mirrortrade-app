import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Animated,
  Image,
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

const BRAND_BLUE = '#1F06FF';

type Tab = 'signin' | 'signup';

export default function Auth() {
  const [tab, setTab] = useState<Tab>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirm, setConfirm] = useState('');

  const slideAnim = useRef(new Animated.Value(0)).current;

  const switchTab = (newTab: Tab) => {
    if (newTab === tab) return;
    setTab(newTab);
    Animated.spring(slideAnim, {
      toValue: newTab === 'signup' ? 1 : 0,
      tension: 80,
      friction: 12,
      useNativeDriver: false,
    }).start();
  };

  const tabIndicatorLeft = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['2%', '50%'],
  });

  return (
    <View style={s.root}>
      <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={s.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >

            {/* ── Header ─────────────────────────────────────── */}
            <View style={s.header}>
              <Pressable onPress={() => router.back()} style={s.backBtn}>
                <Ionicons name="arrow-back" size={19} color="rgba(255,255,255,0.6)" />
              </Pressable>
              <Image
                source={require('../assets/images/logo-mark.png')}
                style={s.logoSmall}
                resizeMode="contain"
              />
            </View>

            {/* ── Title ──────────────────────────────────────── */}
            <View style={s.titleBlock}>
              <Text style={s.heading}>
                {tab === 'signin' ? 'Welcome back.' : 'Create account.'}
              </Text>
              <Text style={s.subheading}>
                {tab === 'signin'
                  ? 'Sign in to continue to Trallo'
                  : 'Start copying elite traders today'}
              </Text>
            </View>

            {/* ── Tab switcher ───────────────────────────────── */}
            <View style={s.tabBar}>
              <Animated.View style={[s.tabIndicator, { left: tabIndicatorLeft }]} />
              <Pressable style={s.tabBtn} onPress={() => switchTab('signin')}>
                <Text style={[s.tabText, tab === 'signin' && s.tabTextActive]}>
                  Sign in
                </Text>
              </Pressable>
              <Pressable style={s.tabBtn} onPress={() => switchTab('signup')}>
                <Text style={[s.tabText, tab === 'signup' && s.tabTextActive]}>
                  Sign up
                </Text>
              </Pressable>
            </View>

            {/* ── Form ───────────────────────────────────────── */}
            <View style={s.form}>
              {tab === 'signup' && (
                <Field
                  label="Full name"
                  value={name}
                  onChangeText={setName}
                  placeholder="Alex Morgan"
                  icon="person-outline"
                  autoCapitalize="words"
                />
              )}
              <Field
                label="Email address"
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                icon="mail-outline"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Field
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                icon="lock-closed-outline"
                secureTextEntry={!showPassword}
                rightIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                onRightPress={() => setShowPassword(v => !v)}
              />
              {tab === 'signup' && (
                <Field
                  label="Confirm password"
                  value={confirm}
                  onChangeText={setConfirm}
                  placeholder="••••••••"
                  icon="lock-closed-outline"
                  secureTextEntry={!showConfirm}
                  rightIcon={showConfirm ? 'eye-off-outline' : 'eye-outline'}
                  onRightPress={() => setShowConfirm(v => !v)}
                />
              )}

              {tab === 'signin' && (
                <Pressable style={s.forgot}>
                  <Text style={s.forgotText}>Forgot password?</Text>
                </Pressable>
              )}

              {/* Submit */}
              <Pressable
                onPress={() => router.replace('/(tabs)')}
                style={({ pressed }) => [
                  s.submitBtn,
                  pressed && { opacity: 0.87, transform: [{ scale: 0.98 }] },
                ]}
              >
                <Text style={s.submitText}>
                  {tab === 'signin' ? 'Sign in' : 'Create account'}
                </Text>
                <Ionicons name="arrow-forward" size={17} color="#fff" />
              </Pressable>

              {/* Divider */}
              <View style={s.divider}>
                <View style={s.divLine} />
                <Text style={s.divText}>or</Text>
                <View style={s.divLine} />
              </View>

              {/* Social buttons */}
              <View style={s.socialRow}>
                <SocialBtn icon="logo-google" label="Google" />
                <SocialBtn icon="logo-apple" label="Apple" />
              </View>

              {tab === 'signup' && (
                <Text style={s.terms}>
                  By creating an account you agree to our{' '}
                  <Text style={s.termsLink}>Terms of Service</Text>
                  {' '}and{' '}
                  <Text style={s.termsLink}>Privacy Policy</Text>.
                </Text>
              )}
            </View>

            {/* ── Deriv notice ───────────────────────────────── */}
            <View style={s.notice}>
              <Ionicons name="shield-checkmark-outline" size={14} color={BRAND_BLUE} />
              <Text style={s.noticeText}>
                Trallo never holds your funds. All trading happens in your own broker account.
              </Text>
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

// ─── Field ────────────────────────────────────────────────────────────────────

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  secureTextEntry,
  rightIcon,
  onRightPress,
  keyboardType,
  autoCapitalize,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  icon: keyof typeof Ionicons.glyphMap;
  secureTextEntry?: boolean;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
  keyboardType?: 'email-address' | 'default';
  autoCapitalize?: 'none' | 'words' | 'sentences';
}) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={s.fieldWrap}>
      <Text style={s.fieldLabel}>{label}</Text>
      <View style={[s.fieldBox, focused && s.fieldBoxFocused]}>
        <Ionicons
          name={icon}
          size={16}
          color={focused ? BRAND_BLUE : 'rgba(255,255,255,0.25)'}
          style={s.fieldIcon}
        />
        <TextInput
          style={s.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="rgba(255,255,255,0.18)"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType ?? 'default'}
          autoCapitalize={autoCapitalize ?? 'sentences'}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {rightIcon && (
          <Pressable onPress={onRightPress} hitSlop={10}>
            <Ionicons name={rightIcon} size={17} color="rgba(255,255,255,0.3)" />
          </Pressable>
        )}
      </View>
    </View>
  );
}

// ─── Social button ────────────────────────────────────────────────────────────

function SocialBtn({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return (
    <Pressable style={({ pressed }) => [s.socialBtn, pressed && { opacity: 0.65 }]}>
      <Ionicons name={icon} size={18} color="rgba(255,255,255,0.7)" />
      <Text style={s.socialText}>{label}</Text>
    </Pressable>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  safe: { flex: 1 },
  scroll: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 40 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 36,
    paddingTop: 4,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  logoSmall: {
    width: 44,
    height: 44,
  },

  // Title
  titleBlock: { marginBottom: 28 },
  heading: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -1.2,
    lineHeight: 38,
  },
  subheading: {
    color: 'rgba(255,255,255,0.38)',
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
    fontWeight: '400',
  },

  // Tab bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    padding: 4,
    marginBottom: 28,
    position: 'relative',
    height: 44,
  },
  tabIndicator: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    width: '48%',
    backgroundColor: 'rgba(31,6,255,0.25)',
    borderRadius: 9,
    borderWidth: 1,
    borderColor: 'rgba(31,6,255,0.4)',
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    color: 'rgba(255,255,255,0.3)',
    fontWeight: '700',
    fontSize: 14,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },

  // Form
  form: { gap: 0 },
  fieldWrap: { marginBottom: 16 },
  fieldLabel: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  fieldBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    paddingHorizontal: 14,
    height: 52,
  },
  fieldBoxFocused: {
    borderColor: BRAND_BLUE,
    backgroundColor: 'transparent',
  },
  fieldIcon: { marginRight: 10 },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
  },

  forgot: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    marginTop: -4,
  },
  forgotText: {
    color: BRAND_BLUE,
    fontSize: 13,
    fontWeight: '600',
  },

  // Submit
  submitBtn: {
    height: 56,
    borderRadius: 14,
    backgroundColor: BRAND_BLUE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },

  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 22,
  },
  divLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  divText: {
    color: 'rgba(255,255,255,0.25)',
    fontSize: 12,
    fontWeight: '600',
  },

  // Social
  socialRow: { flexDirection: 'row', gap: 10 },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 50,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
  },
  socialText: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 14,
    fontWeight: '600',
  },

  // Terms
  terms: {
    color: 'rgba(255,255,255,0.28)',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 17,
    marginTop: 16,
  },
  termsLink: { color: BRAND_BLUE },

  // Notice
  notice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 28,
    backgroundColor: 'rgba(31,6,255,0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(31,6,255,0.15)',
    padding: 12,
  },
  noticeText: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 12,
    lineHeight: 17,
    flex: 1,
  },
});
