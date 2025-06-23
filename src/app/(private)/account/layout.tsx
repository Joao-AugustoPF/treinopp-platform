import { Metadata } from 'next';
import { CONFIG } from 'src/global-config';
import { AccountLayout } from 'src/features/account/sections/view/account-layout';

export const metadata: Metadata = {
  title: `Minha Conta | ${CONFIG.appName}`,
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AccountLayout>{children}</AccountLayout>;
}
