import 'src/global.css';

import type { Metadata, Viewport } from 'next';

import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';

import { CONFIG } from 'src/global-config';
import { primary } from 'src/theme/core/palette';
import { LocalizationProvider } from 'src/locales';
import { themeConfig, ThemeProvider } from 'src/theme';
import { QueryProvider } from 'src/providers/query-provider';

import { Snackbar } from 'src/components/snackbar';
import { ProgressBar } from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { detectSettings } from 'src/components/settings/server';
import { SettingsDrawer, defaultSettings, SettingsProvider } from 'src/components/settings';

import { AuthProvider as JwtAuthProvider } from 'src/auth/context/jwt';

// ----------------------------------------------------------------------

const AuthProvider = JwtAuthProvider;

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: primary.main,
};

export const metadata: Metadata = {
  icons: [
    {
      rel: 'icon',
      url: `${CONFIG.assetsDir}/favicon.ico`,
    },
  ],
};

// ----------------------------------------------------------------------

type RootLayoutProps = {
  children: React.ReactNode;
};

async function getAppConfig() {
  if (CONFIG.isStaticExport) {
    return {
      lang: 'pt-br',
      i18nLang: undefined,
      cookieSettings: undefined,
      dir: defaultSettings.direction,
    };
  } else {
    const [settings] = await Promise.all([detectSettings()]);

    return {
      cookieSettings: settings,
      dir: settings.direction,
    };
  }
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const appConfig = await getAppConfig();

  return (
    <html lang={appConfig.lang} dir={appConfig.dir} suppressHydrationWarning>
      <body>
        <QueryProvider>
          <InitColorSchemeScript
            defaultMode={themeConfig.defaultMode}
            modeStorageKey={themeConfig.modeStorageKey}
            attribute={themeConfig.cssVariables.colorSchemeSelector}
          />

          {/* <ProfileProvider> */}
          <AuthProvider>
            <SettingsProvider
              cookieSettings={appConfig.cookieSettings}
              defaultSettings={defaultSettings}
            >
              {/* <SWRConfig
                value={{
                  dedupingInterval: 2000, // não refaz requisição duplicada em 2s
                  revalidateOnFocus: true, // ao voltar o foco da janela, refaz
                  revalidateOnReconnect: true,
                  
                }}
              > */}
                <LocalizationProvider>
                  <AppRouterCacheProvider options={{ key: 'css' }}>
                    <ThemeProvider
                      defaultMode={themeConfig.defaultMode}
                      modeStorageKey={themeConfig.modeStorageKey}
                    >
                      <MotionLazy>
                        <Snackbar />
                        <ProgressBar />
                        <SettingsDrawer defaultSettings={defaultSettings} />
                        {children}
                      </MotionLazy>
                    </ThemeProvider>
                  </AppRouterCacheProvider>
                </LocalizationProvider>
              {/* </SWRConfig> */}
            </SettingsProvider>
          </AuthProvider>
          {/* </ProfileProvider> */}
        </QueryProvider>
      </body>
    </html>
  );
}
