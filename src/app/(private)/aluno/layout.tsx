import { Metadata } from 'next';
import { CONFIG } from 'src/global-config';

export const metadata: Metadata = {
  title: `Alunos | ${CONFIG.appName}`,
};

export default function AlunoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
