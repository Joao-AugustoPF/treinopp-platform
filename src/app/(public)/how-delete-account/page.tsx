import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { HowDeleteAccountView } from 'src/sections/how-delete-account/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Como excluir a conta - ${CONFIG.appName}` };

export default function Page() {
  return <HowDeleteAccountView />;
}
