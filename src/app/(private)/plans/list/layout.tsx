import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

export const metadata: Metadata = { title: `Planos | Dashboard - ${CONFIG.appName}` };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
