export type ThemeMode = 'system' | 'light' | 'dark';

export type AppColors = {
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textMuted: string;
  border: string;
  primary: string;
  primaryPressed: string;
  secondary: string;
  success: string;
  warning: string;
  danger: string;
  focus: string;
  shadow: string;
};

export const lightColors: AppColors = {
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceAlt: '#F1F5F9',
  text: '#0F172A',
  textMuted: '#475569',
  border: '#CBD5E1',
  primary: '#4F46E5',
  primaryPressed: '#3730A3',
  secondary: '#0F766E',
  success: '#15803D',
  warning: '#B45309',
  danger: '#B91C1C',
  focus: '#0F766E',
  shadow: '#0F172A',
};

export const darkColors: AppColors = {
  background: '#020617',
  surface: '#0F172A',
  surfaceAlt: '#1E293B',
  text: '#F8FAFC',
  textMuted: '#CBD5E1',
  border: '#475569',
  primary: '#818CF8',
  primaryPressed: '#A5B4FC',
  secondary: '#5EEAD4',
  success: '#4ADE80',
  warning: '#FBBF24',
  danger: '#FCA5A5',
  focus: '#5EEAD4',
  shadow: '#000000',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  pill: 999,
};
