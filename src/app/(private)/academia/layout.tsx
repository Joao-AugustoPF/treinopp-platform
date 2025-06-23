import { Metadata } from 'next';
import { CONFIG } from 'src/global-config';

export const metadata: Metadata = {
  title: `Academias | ${CONFIG.appName}`,
};

export default function AcademiaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
