import React, { createContext, useContext, useState } from 'react';

export const darkColors = {
  base: '#000000',
  elevated: '#111115',
  card: '#1D1D23',
  hover: '#28282F',
  active: '#34343D',
  cyan: '#1F06FF',
  blue: '#1F06FF',
  violet: '#1F06FF',
  profit: '#1F06FF',
  loss: '#FF5252',
  tradeProfit: '#00E676',
  tradeLoss: '#FF5252',
  amber: '#FFB800',
  text: '#FFFFFF',
  muted: 'rgba(255,255,255,0.4)',
  subtle: 'rgba(255,255,255,0.6)',
  disabled: 'rgba(255,255,255,0.2)',
  successSurface: 'rgba(31,6,255,0.15)',
  dangerSurface: 'rgba(255,82,82,0.15)',
  border: 'rgba(255,255,255,0.16)',
} as const;

export const lightColors = {
  base: '#FFFFFF',
  elevated: '#F8F8FA',
  card: '#F0F0F4',
  hover: '#E6E6EC',
  active: '#DADAE2',
  cyan: '#1F06FF',
  blue: '#1F06FF',
  violet: '#1F06FF',
  profit: '#1F06FF',
  loss: '#D50000',
  tradeProfit: '#00A94F',
  tradeLoss: '#D50000',
  amber: '#E65100',
  text: '#000000',
  muted: 'rgba(0,0,0,0.45)',
  subtle: 'rgba(0,0,0,0.6)',
  disabled: 'rgba(0,0,0,0.15)',
  successSurface: 'rgba(31,6,255,0.06)',
  dangerSurface: 'rgba(213,0,0,0.06)',
  border: '#D8D8E0',
} as const;

export type ThemeColors = typeof darkColors | typeof lightColors;

type ThemeContextType = {
  theme: 'light' | 'dark';
  colors: ThemeColors;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const colors = theme === 'light' ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
