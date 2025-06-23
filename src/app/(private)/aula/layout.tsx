import { Metadata } from 'next';
import { CONFIG } from 'src/global-config';

export const metadata: Metadata = {
  title: `Aulas | ${CONFIG.appName}`,
};

export default function AulaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
