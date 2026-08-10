export const colors = {
  base: '#000000', elevated: 'rgba(255,255,255,0.04)', card: 'rgba(255,255,255,0.09)', hover: 'rgba(255,255,255,0.08)', active: 'rgba(255,255,255,0.12)',
  cyan: '#1F06FF', blue: '#1F06FF', violet: '#1F06FF', profit: '#1F06FF', loss: '#FF5252', amber: '#FFB800',
  tradeProfit: '#00E676', tradeLoss: '#FF5252',
  text: '#FFFFFF', muted: 'rgba(255,255,255,0.4)', subtle: 'rgba(255,255,255,0.6)', disabled: 'rgba(255,255,255,0.2)', successSurface: 'rgba(31,6,255,0.15)', dangerSurface: 'rgba(255,82,82,0.15)',
} as const;

export const space = { xs: 4, sm: 8, md: 12, base: 16, lg: 24, xl: 32 } as const;
export const radius = { sm: 8, md: 12, lg: 16, xl: 20, full: 999 } as const;

// ── Typography ─────────────────────────────────────────────
// Inter — the standard font for professional fintech & trading UIs
export const fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extrabold: 'Inter_800ExtraBold',
} as const;

export const typography = {
  display:  { fontFamily: 'Inter_800ExtraBold', fontSize: 36, letterSpacing: -1.2, lineHeight: 42 },
  heading:  { fontFamily: 'Inter_700Bold',      fontSize: 26, letterSpacing: -0.6, lineHeight: 32 },
  title:    { fontFamily: 'Inter_700Bold',      fontSize: 20, letterSpacing: -0.4, lineHeight: 26 },
  body:     { fontFamily: 'Inter_400Regular',   fontSize: 15, letterSpacing:  0,   lineHeight: 22 },
  bodyMed:  { fontFamily: 'Inter_500Medium',    fontSize: 15, letterSpacing:  0,   lineHeight: 22 },
  label:    { fontFamily: 'Inter_600SemiBold',  fontSize: 13, letterSpacing:  0.1, lineHeight: 18 },
  caption:  { fontFamily: 'Inter_500Medium',    fontSize: 11, letterSpacing:  0.4, lineHeight: 15 },
  badge:    { fontFamily: 'Inter_700Bold',      fontSize: 10, letterSpacing:  0.8, lineHeight: 13 },
  // Numbers: tabular figures look sharp in data displays
  numeric:  { fontFamily: 'Inter_700Bold',      fontSize: 24, letterSpacing: -0.5, lineHeight: 30 },
  numericLg:{ fontFamily: 'Inter_800ExtraBold', fontSize: 32, letterSpacing: -1,   lineHeight: 38 },
} as const;
