
import { ReactNode } from 'react';

export interface NavItem {
  name: string;
  path: string;
  icon: ReactNode;
}

export interface ThemeConfig {
  theme: 'light' | 'dark' | 'system';
  reduceMotion: boolean;
}
