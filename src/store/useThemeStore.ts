// Theme Store for VibhoHCM
// This store manages theme-related state and actions

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createTheme, Theme } from '@mui/material/styles';
import { lightTheme, darkTheme } from '../theme';

interface ThemeState {
  // State
  mode: 'light' | 'dark';
  theme: Theme;
  
  // Actions
  toggleTheme: () => void;
  setTheme: (mode: 'light' | 'dark') => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      // Initial state
      mode: 'light',
      theme: lightTheme,
      
      // Actions
      toggleTheme: () => {
        set(state => {
          const newMode = state.mode === 'light' ? 'dark' : 'light';
          return {
            mode: newMode,
            theme: newMode === 'light' ? lightTheme : darkTheme
          };
        });
      },
      
      setTheme: (mode) => {
        set({
          mode,
          theme: mode === 'light' ? lightTheme : darkTheme
        });
      }
    }),
    {
      name: 'theme-storage',
      partialize: (state) => ({ mode: state.mode })
    }
  )
);

export default useThemeStore;