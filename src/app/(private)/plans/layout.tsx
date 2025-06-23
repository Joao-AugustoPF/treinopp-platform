import { Metadata } from 'next';
import { CONFIG } from 'src/global-config';

export const metadata: Metadata = {
  title: `Planos | ${CONFIG.appName}`,
};

export default function PlansLayout({ children }: { children: React.ReactNode }) {
  return children;
}
