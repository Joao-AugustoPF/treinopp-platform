import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';
import { DetentoListView } from 'src/features/detentos/detento/sections/view/detento-list-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Lista de detentos - ${CONFIG.appName}` };

export default function Page() {
  return <DetentoListView />;
}
