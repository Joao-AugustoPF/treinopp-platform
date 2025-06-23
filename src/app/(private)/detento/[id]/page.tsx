import { DetentoDetailsView } from 'src/features/detentos/detento/sections/view/detento-details-view';

type DetentoDetailsPageProps = {
  params: {
    id: string;
  };
};

export const dynamic = 'force-dynamic';

export default function DetentoDetailsPage({ params }: DetentoDetailsPageProps) {
  return <DetentoDetailsView id={params.id} />;
}
