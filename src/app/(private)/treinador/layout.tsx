import { Metadata } from 'next';
import { CONFIG } from 'src/global-config';

export const metadata: Metadata = {
  title: `Treinadores | ${CONFIG.appName}`,
};

export default function TreinadorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
