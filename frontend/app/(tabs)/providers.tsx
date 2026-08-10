import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card, Page } from '@/components/layout';
import { Pill, PrimaryButton, ScreenTitle, ThemeToggle } from '@/components/ui';
import { providers } from '@/data/demo';
import { useTheme } from '@/context/ThemeContext';

type Settings = { lotSize: number; mode: 'Manual' | 'Auto'; maxTrades: number; useStopLoss: boolean };
const initialSettings: Record<string, Settings> = Object.fromEntries(providers.map((provider) => [provider.name, { lotSize: 0.1, mode: provider.mode as Settings['mode'], maxTrades: 3, useStopLoss: true }]));

export default function Providers() {
  const { colors } = useTheme();
  const [openProvider, setOpenProvider] = useState<string | null>(null);
  const [settings, setSettings] = useState(initialSettings);
  const update = (name: string, updateSettings: Partial<Settings>) => setSettings((current) => ({ ...current, [name]: { ...current[name], ...updateSettings } }));
  return <Page>
    <ScreenTitle eyebrow="Your network" title="Providers" action={<ThemeToggle />} />
    <PrimaryButton label="Discover providers" icon="add" />
    <Text style={[s.subhead, { color: colors.subtle }]}>FOLLOWING · {providers.length}</Text>
    {providers.map((provider) => {
      const isOpen = openProvider === provider.name;
      const providerSettings = settings[provider.name];
      return <Card key={provider.name} style={s.card}>
        <View style={s.top}>
          <View style={[s.avatar, { backgroundColor: provider.color }]}><Text style={[s.initials, { color: colors.base }]}>{provider.initials}</Text></View>
          <View style={{ flex: 1 }}><Text style={[s.name, { color: colors.text }]}>{provider.name}</Text><Text style={[s.followers, { color: colors.subtle }]}>{provider.followers} followers</Text></View>
          <Pill label={providerSettings.mode} tone={providerSettings.mode === 'Manual' ? 'amber' : 'cyan'} />
        </View>
        <View style={[s.metrics, { borderTopColor: colors.border }]}>
          <Metric value={provider.winRate} label="Win rate" /><Metric value={provider.rr} label="Avg R:R" /><Metric value="Live" label="Status" accent={colors.tradeProfit} />
        </View>
        <Pressable onPress={() => setOpenProvider(isOpen ? null : provider.name)} style={({ pressed }) => [s.settings, { backgroundColor: colors.card, borderColor: colors.border }, pressed && { opacity: .7 }]}>
          <Ionicons name="options-outline" size={17} color={colors.cyan} /><Text style={[s.settingsText, { color: colors.text }]}>Copy settings</Text><Text style={[s.settingsSummary, { color: colors.subtle }]}>{providerSettings.lotSize.toFixed(2)} lots</Text><Ionicons name={isOpen ? 'chevron-up' : 'chevron-forward'} size={16} color={colors.subtle} />
        </Pressable>
        {isOpen && <View style={[s.panel, { borderTopColor: colors.border }]}>
          <Text style={[s.panelTitle, { color: colors.text }]}>Execution preferences</Text>
          <Text style={[s.panelCopy, { color: colors.muted }]}>These settings apply only to {provider.name}.</Text>
          <Text style={[s.controlLabel, { color: colors.subtle }]}>COPY MODE</Text>
          <View style={[s.segmented, { backgroundColor: colors.card }]}>{(['Manual','Auto'] as const).map((mode) => <Pressable key={mode} onPress={() => update(provider.name, { mode })} style={[s.segment, providerSettings.mode === mode && { backgroundColor: colors.base, borderColor: colors.border }]}><Text style={[s.segmentText, { color: providerSettings.mode === mode ? colors.text : colors.subtle }]}>{mode}</Text></Pressable>)}</View>
          <Control label="Lot size" value={`${providerSettings.lotSize.toFixed(2)} lots`} onDecrease={() => update(provider.name, { lotSize: Math.max(.01, +(providerSettings.lotSize - .01).toFixed(2)) })} onIncrease={() => update(provider.name, { lotSize: +(providerSettings.lotSize + .01).toFixed(2) })} />
          <Control label="Max open trades" value={String(providerSettings.maxTrades)} onDecrease={() => update(provider.name, { maxTrades: Math.max(1, providerSettings.maxTrades - 1) })} onIncrease={() => update(provider.name, { maxTrades: Math.min(10, providerSettings.maxTrades + 1) })} />
          <Pressable onPress={() => update(provider.name, { useStopLoss: !providerSettings.useStopLoss })} style={[s.stopLoss, { borderColor: colors.border }]}><View style={{flex:1}}><Text style={[s.stopLossTitle,{color:colors.text}]}>Use provider stop loss</Text><Text style={[s.stopLossCopy,{color:colors.muted}]}>Close trades using the signal’s safety level.</Text></View><View style={[s.switch, { backgroundColor: providerSettings.useStopLoss ? colors.cyan : colors.hover }]}><View style={[s.knob, providerSettings.useStopLoss && s.knobOn]} /></View></Pressable>
          <Pressable style={[s.save, { backgroundColor: colors.cyan }]} onPress={() => setOpenProvider(null)}><Text style={[s.saveText, { color: colors.base }]}>Save copy settings</Text></Pressable>
        </View>}
      </Card>;
    })}
  </Page>;
}
function Metric({ value, label, accent }: { value: string; label: string; accent?: string }) { const { colors }=useTheme(); return <View><Text style={[s.metric,{color:accent ?? colors.text}]}>{value}</Text><Text style={[s.metricLabel,{color:colors.subtle}]}>{label}</Text></View>; }
function Control({label,value,onDecrease,onIncrease}:{label:string;value:string;onDecrease:()=>void;onIncrease:()=>void}){const {colors}=useTheme(); return <View style={s.control}><Text style={[s.controlLabel,{color:colors.subtle}]}>{label.toUpperCase()}</Text><View style={s.stepper}><Pressable onPress={onDecrease} style={[s.stepButton,{borderColor:colors.border}]}><Ionicons name="remove" size={16} color={colors.text}/></Pressable><Text style={[s.stepValue,{color:colors.text}]}>{value}</Text><Pressable onPress={onIncrease} style={[s.stepButton,{borderColor:colors.border}]}><Ionicons name="add" size={16} color={colors.text}/></Pressable></View></View>}
const s=StyleSheet.create({subhead:{fontFamily:'Inter_700Bold',fontSize:10,letterSpacing:1,marginTop:28,marginBottom:10},card:{marginBottom:12},top:{flexDirection:'row',alignItems:'center',gap:11},avatar:{width:42,height:42,borderRadius:14,alignItems:'center',justifyContent:'center'},initials:{fontFamily:'Inter_700Bold',fontSize:13},name:{fontFamily:'Inter_700Bold',fontSize:16},followers:{fontFamily:'Inter_400Regular',fontSize:11,marginTop:3},metrics:{flexDirection:'row',justifyContent:'space-between',marginTop:18,borderTopWidth:1,paddingTop:14},metric:{fontFamily:'Inter_700Bold',fontSize:15},metricLabel:{fontFamily:'Inter_400Regular',fontSize:10,marginTop:3},settings:{marginTop:16,borderRadius:10,padding:11,borderWidth:1,flexDirection:'row',alignItems:'center',gap:8},settingsText:{fontFamily:'Inter_600SemiBold',fontSize:12,flex:1},settingsSummary:{fontFamily:'Inter_500Medium',fontSize:11},panel:{borderTopWidth:1,marginTop:15,paddingTop:16},panelTitle:{fontFamily:'Inter_700Bold',fontSize:15},panelCopy:{fontFamily:'Inter_400Regular',fontSize:11,lineHeight:16,marginTop:4},controlLabel:{fontFamily:'Inter_700Bold',fontSize:10,letterSpacing:.8,marginTop:17},segmented:{height:40,borderRadius:10,padding:3,flexDirection:'row',marginTop:7},segment:{flex:1,borderRadius:7,borderWidth:1,borderColor:'transparent',alignItems:'center',justifyContent:'center'},segmentText:{fontFamily:'Inter_600SemiBold',fontSize:12},control:{marginTop:17},stepper:{flexDirection:'row',alignItems:'center',gap:13,marginTop:8},stepButton:{width:36,height:36,borderWidth:1,borderRadius:10,alignItems:'center',justifyContent:'center'},stepValue:{fontFamily:'Inter_700Bold',fontSize:14,minWidth:78,textAlign:'center'},stopLoss:{borderWidth:1,borderRadius:12,padding:12,flexDirection:'row',alignItems:'center',marginTop:18,gap:12},stopLossTitle:{fontFamily:'Inter_600SemiBold',fontSize:12},stopLossCopy:{fontFamily:'Inter_400Regular',fontSize:10,lineHeight:15,marginTop:3},switch:{width:40,height:24,borderRadius:12,padding:3},knob:{width:18,height:18,borderRadius:9,backgroundColor:'#FFFFFF'},knobOn:{alignSelf:'flex-end'},save:{height:46,borderRadius:12,marginTop:16,justifyContent:'center',alignItems:'center'},saveText:{fontFamily:'Inter_700Bold',fontSize:13}});
