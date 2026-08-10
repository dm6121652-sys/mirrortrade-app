import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View, type ViewStyle, Image } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { radius, space } from '@/theme';

export function BrandMark({ compact = false }: { compact?: boolean }) {
  const { theme } = useTheme();
  return (
    <View style={styles.brand}>
      <Image
        source={theme === 'light' ? require('../../assets/images/logo-mark-light.png') : require('../../assets/images/logo-mark.png')}
        style={styles.brandIcon}
        resizeMode="contain"
      />
    </View>
  );
}

export function Pill({ label, tone = 'cyan' }: { label: string; tone?: 'cyan' | 'amber' | 'violet' | 'green' }) {
  const { colors } = useTheme();
  const color = {
    cyan: colors.cyan,
    amber: colors.amber,
    violet: colors.violet,
    green: colors.tradeProfit,
  }[tone];
  return (
    <View style={[styles.pill, { backgroundColor: `${color}20` }]}>
      <Text style={[styles.pillText, { color }]}>{label}</Text>
    </View>
  );
}

export function ScreenTitle({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={styles.titleRow}>
      <View>
        {eyebrow && <Text style={[styles.eyebrow, { color: colors.cyan }]}>{eyebrow}</Text>}
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      </View>
      {action}
    </View>
  );
}

export function IconButton({ icon, onPress, style }: { icon: keyof typeof Ionicons.glyphMap; onPress?: () => void; style?: ViewStyle }) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.iconButton,
        { backgroundColor: colors.elevated, borderColor: colors.card },
        style,
      ]}
    >
      <Ionicons name={icon} size={20} color={colors.text} />
    </Pressable>
  );
}

export function ThemeToggle() {
  const { colors, theme, toggleTheme } = useTheme();
  return <IconButton icon={theme === 'light' ? 'moon-outline' : 'sunny-outline'} onPress={toggleTheme} />;
}

export function PrimaryButton({ label, onPress, icon = 'arrow-forward' }: { label: string; onPress?: () => void; icon?: keyof typeof Ionicons.glyphMap }) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.primaryButton,
        { backgroundColor: colors.cyan },
        pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
      ]}
    >
      <Text style={[styles.primaryText, { color: colors.base }]}>{label}</Text>
      <Ionicons name={icon} color={colors.base} size={18} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  brand: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  brandIcon: { width: 36, height: 36 },
  pill: { alignSelf: 'flex-start', paddingHorizontal: 9, paddingVertical: 5, borderRadius: radius.full },
  pillText: { fontFamily: 'Inter_700Bold', fontSize: 11, letterSpacing: 0.6, textTransform: 'uppercase' },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: space.lg },
  eyebrow: { fontFamily: 'Inter_700Bold', fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 4 },
  title: { fontFamily: 'Inter_800ExtraBold', fontSize: 28, letterSpacing: -0.8 },
  iconButton: { width: 42, height: 42, borderRadius: 14, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  primaryButton: { minHeight: 52, paddingHorizontal: 18, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: space.sm },
  primaryText: { fontFamily: 'Inter_700Bold', fontSize: 15, letterSpacing: 0.1 },
});
