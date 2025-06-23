import { UnidadeDetailsView } from 'src/features/unidades/unidade/sections/view/unidade-details-view';

type DetentoDetailsPageProps = {
  params: {
    id: string;
  };
};

export const dynamic = 'force-dynamic';

export default function UnidadeDetailsPage({ params }: DetentoDetailsPageProps) {
  return <UnidadeDetailsView id={params.id} />;
}
