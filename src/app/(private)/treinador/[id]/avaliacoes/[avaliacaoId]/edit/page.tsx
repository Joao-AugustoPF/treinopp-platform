import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';
import { AvaliacaoEditView } from 'src/features/treinadores/avaliacao/sections/view/avaliacao-edit-view';

export const metadata: Metadata = { title: `Avaliação edit | Dashboard - ${CONFIG.appName}` };

type Props = {
  params: { id: string; avaliacaoId: string };
};

export default async function Page({ params }: Props) {
  const { avaliacaoId, id } = params;

  return <AvaliacaoEditView avaliacaoId={avaliacaoId} treinadorId={id} />;
}
