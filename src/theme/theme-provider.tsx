'use client';

import type { Theme } from '@mui/material/styles';
import type { ThemeProviderProps as MuiThemeProviderProps } from '@mui/material/styles/ThemeProvider';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as ThemeVarsProvider } from '@mui/material/styles';

import { defaultLang } from 'src/locales/all-langs';

import { useSettingsContext } from 'src/components/settings';

import { createTheme } from './create-theme';
import { Rtl } from './with-settings/right-to-left';

import type {} from './extend-theme-types';
import type { ThemeOptions } from './types';

// ----------------------------------------------------------------------

export type ThemeProviderProps = Omit<MuiThemeProviderProps, 'theme'> & {
  theme?: Theme;
  themeOverrides?: ThemeOptions;
};

export function ThemeProvider({ themeOverrides, children, ...other }: ThemeProviderProps) {
  const settings = useSettingsContext();

  const theme = createTheme({
    settingsState: settings.state,
    localeComponents: defaultLang?.systemValue,
    themeOverrides,
  });

  return (
    <ThemeVarsProvider theme={theme} {...other}>
      <CssBaseline />
      <Rtl direction={settings.state.direction!}>{children}</Rtl>
    </ThemeVarsProvider>
  );
}
