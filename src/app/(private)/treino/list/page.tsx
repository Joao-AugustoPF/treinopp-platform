import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Lista de treinos - ${CONFIG.appName}` };

export default function Page() {
  // return <TreinoListView />;
  return <div>Treino</div>;
}
