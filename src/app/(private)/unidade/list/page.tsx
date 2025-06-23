import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';
import { UnidadeListView } from 'src/features/unidades/unidade/sections/view/unidade-list-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Lista de unidades - ${CONFIG.appName}` };

export default function Page() {
  return <UnidadeListView />;
}
