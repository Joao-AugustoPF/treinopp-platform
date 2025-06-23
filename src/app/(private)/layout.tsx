import { Metadata } from 'next';
import { DashboardLayout } from 'src/layouts/dashboard';
import { AuthGuard } from 'src/auth/guard';
import { CONFIG } from 'src/global-config';

export const metadata: Metadata = {
  title: {
    template: `%s | ${CONFIG.appName}`,
    default: CONFIG.appName,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthGuard>
  );
}
