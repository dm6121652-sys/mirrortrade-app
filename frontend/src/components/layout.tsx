import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, space } from '@/theme';
export function Page({ children }: { children: React.ReactNode }) { return <SafeAreaView style={styles.safe} edges={['top']}><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>{children}</ScrollView></SafeAreaView>; }
export function Card({ children, style }: { children: React.ReactNode; style?: object }) { return <View style={[styles.card, style]}>{children}</View>; }
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.base }, content: { padding: space.base, paddingBottom: 108 }, card: { backgroundColor: colors.elevated, borderColor: colors.card, borderWidth: 1, borderRadius: 16, padding: space.base } });
