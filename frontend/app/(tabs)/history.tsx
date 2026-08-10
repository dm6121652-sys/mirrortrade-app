import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { Card, Page } from '@/components/layout';
import { ScreenTitle, ThemeToggle } from '@/components/ui';
import { useTheme } from '@/context/ThemeContext';

export default function History() {
  const { colors } = useTheme();
  return <Page>
    <ScreenTitle eyebrow="Account activity" title="History" action={<ThemeToggle />} />
    <Card>
      <Text style={[s.label, { color: colors.subtle }]}>TOTAL DEMO P&amp;L</Text>
      <Text style={[s.total, { color: colors.tradeProfit }]}>+$1,240.50</Text>
      <Text style={[s.copy, { color: colors.muted }]}>Across 38 completed trades this month</Text>
    </Card>
    <View style={s.empty}>
      <View style={[s.icon, { backgroundColor: colors.successSurface }]}><Ionicons name="receipt-outline" color={colors.cyan} size={28} /></View>
      <Text style={[s.title, { color: colors.text }]}>Your full history is ready</Text>
      <Text style={[s.text, { color: colors.muted }]}>Trades will appear here with filters and export options once the backend is connected.</Text>
    </View>
  </Page>;
}
const s = StyleSheet.create({ label:{fontFamily:'Inter_700Bold',fontSize:10,letterSpacing:1},total:{fontFamily:'Inter_700Bold',fontSize:30,letterSpacing:-.8,marginTop:8},copy:{fontFamily:'Inter_400Regular',fontSize:12,marginTop:5},empty:{alignItems:'center',paddingTop:72,paddingHorizontal:28},icon:{width:62,height:62,borderRadius:21,justifyContent:'center',alignItems:'center'},title:{fontFamily:'Inter_700Bold',fontSize:18,marginTop:18},text:{fontFamily:'Inter_400Regular',textAlign:'center',lineHeight:19,fontSize:13,marginTop:7} });
