import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BRAND_BLUE = '#1F06FF';

export default function Welcome() {
  const logoScale = useRef(new Animated.Value(0.75)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const ctaTranslate = useRef(new Animated.Value(36)).current;
  const ctaOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, tension: 55, friction: 8, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 700, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(ctaOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(ctaTranslate, { toValue: 0, tension: 80, friction: 10, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <View style={s.root}>
      <SafeAreaView style={s.safe} edges={['top', 'bottom']}>

        {/* ── Hero ─────────────────────────────────────────────── */}
        <View style={s.hero}>

          {/* Logo image */}
          <Animated.View style={{ opacity: logoOpacity, transform: [{ scale: logoScale }] }}>
            <Image
              source={require('../assets/images/ChatGPT Image Aug 8, 2026, 05_49_47 PM.png')}
              style={s.logo}
              resizeMode="contain"
            />
          </Animated.View>

        </View>

        {/* ── CTA ──────────────────────────────────────────────── */}
        <Animated.View
          style={[s.cta, { opacity: ctaOpacity, transform: [{ translateY: ctaTranslate }] }]}
        >
          <Pressable
            onPress={() => router.push('/auth')}
            style={({ pressed }) => [s.primaryBtn, pressed && { opacity: 0.87, transform: [{ scale: 0.98 }] }]}
          >
            <Text style={s.primaryText}>Get started</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/auth')}
            style={({ pressed }) => [s.secondaryBtn, pressed && { opacity: 0.65 }]}
          >
            <Text style={s.secondaryText}>Sign in to existing account</Text>
          </Pressable>

          <Text style={s.disclaimer}>
            Trading involves risk. Past performance does not guarantee future results.
          </Text>
        </Animated.View>

      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },
  safe: {
    flex: 1,
    justifyContent: 'space-between',
  },

  // Hero
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 36,
  },
  logo: {
    width: 220,
    height: 220,
  },

  // CTA
  cta: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 12,
  },
  primaryBtn: {
    height: 56,
    borderRadius: 14,
    backgroundColor: BRAND_BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  secondaryBtn: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.13)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  secondaryText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 15,
    fontWeight: '600',
  },
  disclaimer: {
    color: 'rgba(255,255,255,0.22)',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 8,
    paddingTop: 4,
  },
});
