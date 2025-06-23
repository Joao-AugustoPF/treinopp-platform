import { Metadata } from 'next';
import { CONFIG } from 'src/global-config';

export const metadata: Metadata = {
  title: `Notificações | ${CONFIG.appName}`,
};

export default function NotificacaoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
