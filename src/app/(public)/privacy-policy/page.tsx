import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { PrivacyPolicyView } from 'src/sections/privacy-policy/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Política de Privacidade - ${CONFIG.appName}` };

export default function Page() {
  return <PrivacyPolicyView />;
}
