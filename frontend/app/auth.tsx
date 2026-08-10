import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
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
import { useTheme } from '@/context/ThemeContext';

type Tab = 'signin' | 'signup';

export default function Auth() {
  const { colors, theme } = useTheme();
  const [tab, setTab] = useState<Tab>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const { signIn, signUp } = useAuth();

  const slideAnim = useRef(new Animated.Value(0)).current;

  const switchTab = (newTab: Tab) => {
    if (newTab === tab) return;
    setTab(newTab);
    setErrorMsg('');
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
    <View style={[s.root, { backgroundColor: colors.base }]}>
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
              <Pressable
                onPress={() => router.back()}
                style={[s.backBtn, { borderColor: colors.border, backgroundColor: colors.elevated }]}
              >
                <Ionicons name="arrow-back" size={19} color={colors.subtle} />
              </Pressable>
              <Image
                source={
                  theme === 'light'
                    ? require('../assets/images/logo-mark-light.png')
                    : require('../assets/images/logo-mark.png')
                }
                style={s.logoSmall}
                resizeMode="contain"
              />
            </View>

            {/* ── Title ──────────────────────────────────────── */}
            <View style={s.titleBlock}>
              <Text style={[s.heading, { color: colors.text }]}>
                {tab === 'signin' ? 'Welcome back.' : 'Create account.'}
              </Text>
              <Text style={[s.subheading, { color: colors.muted }]}>
                {tab === 'signin'
                  ? 'Sign in to continue to Trallo'
                  : 'Start copying elite traders today'}
              </Text>
            </View>

            {/* ── Tab switcher ───────────────────────────────── */}
            <View style={[s.tabBar, { backgroundColor: colors.elevated, borderColor: colors.border }]}>
              <Animated.View style={[s.tabIndicator, { left: tabIndicatorLeft, borderColor: colors.cyan }]} />
              <Pressable style={s.tabBtn} onPress={() => switchTab('signin')}>
                <Text style={[s.tabText, { color: colors.disabled }, tab === 'signin' && { color: colors.text }]}>
                  Sign in
                </Text>
              </Pressable>
              <Pressable style={s.tabBtn} onPress={() => switchTab('signup')}>
                <Text style={[s.tabText, { color: colors.disabled }, tab === 'signup' && { color: colors.text }]}>
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
              
              {errorMsg !== '' && (
                <Text style={{ color: colors.tradeLoss, fontFamily: 'Inter_500Medium', fontSize: 13, marginBottom: 16 }}>
                  {errorMsg}
                </Text>
              )}

              {tab === 'signin' && (
                <Pressable style={s.forgot}>
                  <Text style={[s.forgotText, { color: colors.cyan }]}>Forgot password?</Text>
                </Pressable>
              )}

              {/* Submit */}
              <Pressable
                disabled={isSubmitting}
                onPress={async () => {
                  setErrorMsg('');
                  setIsSubmitting(true);
                  try {
                    if (tab === 'signup') {
                      if (password !== confirm) {
                        throw new Error('Passwords do not match');
                      }
                      await signUp(email, password);
                    } else {
                      await signIn(email, password);
                    }
                  } catch (e: any) {
                    setErrorMsg(e.response?.data?.message || e.message || 'An error occurred');
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                style={({ pressed }) => [
                  s.submitBtn,
                  { backgroundColor: colors.cyan },
                  (pressed || isSubmitting) && { opacity: 0.87, transform: [{ scale: 0.98 }] },
                ]}
              >
                <Text style={[s.submitText, { color: colors.base }]}>
                  {isSubmitting ? 'Please wait...' : (tab === 'signin' ? 'Sign in' : 'Create account')}
                </Text>
                {!isSubmitting && <Ionicons name="arrow-forward" size={17} color={colors.base} />}
              </Pressable>

              {/* Divider */}
              <View style={s.divider}>
                <View style={[s.divLine, { backgroundColor: colors.border }]} />
                <Text style={[s.divText, { color: colors.disabled }]}>or</Text>
                <View style={[s.divLine, { backgroundColor: colors.border }]} />
              </View>

              {/* Social buttons */}
              <View style={s.socialRow}>
                <SocialBtn icon="logo-google" label="Google" />
                <SocialBtn icon="logo-apple" label="Apple" />
              </View>

              {tab === 'signup' && (
                <Text style={[s.terms, { color: colors.muted }]}>
                  By creating an account you agree to our{' '}
                  <Text style={[s.termsLink, { color: colors.cyan }]}>Terms of Service</Text>
                  {' '}and{' '}
                  <Text style={[s.termsLink, { color: colors.cyan }]}>Privacy Policy</Text>.
                </Text>
              )}
            </View>

            {/* ── Deriv notice ───────────────────────────────── */}
            <View style={[s.notice, { backgroundColor: colors.successSurface, borderColor: colors.border }]}>
              <Ionicons name="shield-checkmark-outline" size={14} color={colors.cyan} />
              <Text style={[s.noticeText, { color: colors.subtle }]}>
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
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <View style={s.fieldWrap}>
      <Text style={[s.fieldLabel, { color: colors.muted }]}>{label}</Text>
      <View
        style={[
          s.fieldBox,
          { borderColor: colors.border },
          focused && { borderColor: colors.cyan }
        ]}
      >
        <Ionicons
          name={icon}
          size={16}
          color={focused ? colors.cyan : colors.disabled}
          style={s.fieldIcon}
        />
        <TextInput
          style={[
            s.input,
            { color: colors.text },
            Platform.OS === 'web' && ({ outlineStyle: 'none' } as any),
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.disabled}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType ?? 'default'}
          autoCapitalize={autoCapitalize ?? 'sentences'}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {rightIcon && (
          <Pressable onPress={onRightPress} hitSlop={10}>
            <Ionicons name={rightIcon} size={17} color={colors.disabled} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

// ─── Social button ────────────────────────────────────────────────────────────

function SocialBtn({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  const { colors } = useTheme();
  return (
    <Pressable
      style={({ pressed }) => [
        s.socialBtn,
        { backgroundColor: colors.elevated, borderColor: colors.border },
        pressed && { opacity: 0.65 }
      ]}
    >
      <Ionicons name={icon} size={18} color={colors.subtle} />
      <Text style={[s.socialText, { color: colors.subtle }]}>{label}</Text>
    </Pressable>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex: 1 },
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoSmall: {
    width: 44,
    height: 44,
  },

  // Title
  titleBlock: { marginBottom: 28 },
  heading: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 32,
    letterSpacing: -1.2,
    lineHeight: 38,
  },
  subheading: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
  },

  // Tab bar
  tabBar: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
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
    backgroundColor: 'transparent',
    borderRadius: 9,
    borderWidth: 1,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    letterSpacing: 0.1,
  },

  // Form
  form: { gap: 0 },
  fieldWrap: { marginBottom: 16 },
  fieldLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  fieldBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    height: 52,
  },
  fieldIcon: { marginRight: 10 },
  input: {
    fontFamily: 'Inter_400Regular',
    flex: 1,
    fontSize: 15,
    backgroundColor: 'transparent',
  },

  forgot: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    marginTop: -4,
  },
  forgotText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
  },

  // Submit
  submitBtn: {
    height: 56,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  submitText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    letterSpacing: 0.1,
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
  },
  divText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
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
    borderWidth: 1,
  },
  socialText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    letterSpacing: 0.1,
  },
  termsLink: {
    fontFamily: 'Inter_600SemiBold',
  },

  // Terms
  terms: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 17,
    marginTop: 16,
  },

  // Notice
  notice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 28,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  noticeText: {
    fontSize: 12,
    lineHeight: 17,
    flex: 1,
  },
});
