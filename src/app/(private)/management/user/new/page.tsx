import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';
import { UserCreateView } from 'src/features/management/users/sections/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Create a new user | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <UserCreateView />;
}
