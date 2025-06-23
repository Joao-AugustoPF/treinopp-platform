import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';
import { AccountNotifications } from 'src/features/account/sections/view/account-notifications';

export const metadata: Metadata = { title: `Minha Conta - ${CONFIG.appName}` };

export default async function Page() {
  return <AccountNotifications />;
}
