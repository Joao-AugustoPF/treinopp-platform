import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';
import { RolesListView } from 'src/features/management/roles/sections/view/roles-list-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Perfis | Gerenciamento - ${CONFIG.appName}` };

export default function Page() {
  return <RolesListView />;
}
