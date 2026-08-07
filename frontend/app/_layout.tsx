import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from '@/theme';

export default function RootLayout() {
  return <SafeAreaProvider><StatusBar style="light" /><Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.base }, animation: 'fade' }}><Stack.Screen name="(tabs)" /><Stack.Screen name="approval" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} /></Stack></SafeAreaProvider>;
}
