import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

export const metadata: Metadata = { title: `Lista de alunos - ${CONFIG.appName}` };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
