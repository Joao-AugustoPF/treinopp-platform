import { AvaliacaoListView } from 'src/features/treinadores/avaliacao/sections/view/avaliacao-list-view';

type AvaliacoesPageProps = {
  params: {
    id: string;
  };
};

export const dynamic = 'force-dynamic';

export default function AvaliacoesPage({ params }: AvaliacoesPageProps) {
  return <AvaliacaoListView id={params.id} />;
}
