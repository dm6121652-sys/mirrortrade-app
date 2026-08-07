import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { colors, radius, space } from '@/theme';

export function BrandMark({ compact = false }: { compact?: boolean }) { return <View style={styles.brand}><View style={styles.brandIcon}><Ionicons name="git-compare-outline" size={18} color={colors.base} /></View>{!compact && <Text style={styles.brandName}>Mirror<Text style={{ color: colors.cyan }}>Trade</Text></Text>}</View>; }
export function Pill({ label, tone = 'cyan' }: { label: string; tone?: 'cyan' | 'amber' | 'violet' | 'green' }) { const color = { cyan: colors.cyan, amber: colors.amber, violet: colors.violet, green: colors.profit }[tone]; return <View style={[styles.pill, { backgroundColor: `${color}20` }]}><Text style={[styles.pillText, { color }]}>{label}</Text></View>; }
export function ScreenTitle({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: React.ReactNode }) { return <View style={styles.titleRow}><View>{eyebrow && <Text style={styles.eyebrow}>{eyebrow}</Text>}<Text style={styles.title}>{title}</Text></View>{action}</View>; }
export function IconButton({ icon, onPress, style }: { icon: keyof typeof Ionicons.glyphMap; onPress?: () => void; style?: ViewStyle }) { return <Pressable onPress={onPress} style={[styles.iconButton, style]}><Ionicons name={icon} size={20} color={colors.text} /></Pressable>; }
export function PrimaryButton({ label, onPress, icon = 'arrow-forward' }: { label: string; onPress?: () => void; icon?: keyof typeof Ionicons.glyphMap }) { return <Pressable onPress={onPress} style={({ pressed }) => [styles.primaryButton, pressed && { opacity: .8, transform: [{ scale: .98 }] }]}><Text style={styles.primaryText}>{label}</Text><Ionicons name={icon} color={colors.base} size={18} /></Pressable>; }
export const styles = StyleSheet.create({
  brand: { flexDirection: 'row', alignItems: 'center', gap: space.sm }, brandIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: colors.cyan, alignItems: 'center', justifyContent: 'center' }, brandName: { color: colors.text, fontSize: 20, fontWeight: '800', letterSpacing: -.5 },
  pill: { alignSelf: 'flex-start', paddingHorizontal: 9, paddingVertical: 5, borderRadius: radius.full }, pillText: { fontSize: 11, fontWeight: '800', letterSpacing: .4, textTransform: 'uppercase' },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: space.lg }, eyebrow: { color: colors.cyan, fontSize: 11, fontWeight: '800', letterSpacing: 1.1, textTransform: 'uppercase', marginBottom: 4 }, title: { color: colors.text, fontSize: 28, fontWeight: '800', letterSpacing: -.8 },
  iconButton: { width: 42, height: 42, borderRadius: 14, backgroundColor: colors.elevated, borderWidth: 1, borderColor: colors.card, justifyContent: 'center', alignItems: 'center' },
  primaryButton: { minHeight: 52, paddingHorizontal: 18, borderRadius: radius.md, backgroundColor: colors.cyan, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: space.sm }, primaryText: { color: colors.base, fontSize: 15, fontWeight: '800' },
});
