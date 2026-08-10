import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

const icon: Record<string, keyof typeof Ionicons.glyphMap> = {
  index: 'grid-outline',
  feed: 'pulse-outline',
  providers: 'people-outline',
  history: 'receipt-outline',
  profile: 'person-outline',
};

export default function TabLayout() {
  const { colors, theme } = useTheme();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.cyan,
        tabBarInactiveTintColor: colors.subtle,
        tabBarStyle: {
          backgroundColor: colors.base,
          borderTopColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
          height: 74,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontWeight: '700',
          fontSize: 10,
        },
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={icon[route.name] ?? 'ellipse-outline'} color={color} size={size} />
        ),
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Dashboard' }} />
      <Tabs.Screen name="feed" options={{ title: 'Trade Feed' }} />
      <Tabs.Screen name="providers" options={{ title: 'Providers' }} />
      <Tabs.Screen name="history" options={{ title: 'History' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
