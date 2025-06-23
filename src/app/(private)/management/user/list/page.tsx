import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';
import { UserListView } from 'src/features/management/users/sections/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: `Lista de Usuários | Gerenciamento - ${CONFIG.appName}`,
};

export default function Page() {
  return <UserListView />;
}
