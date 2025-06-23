import { DetentoAgendaView } from 'src/features/detentos/detento/sections/view';

type DetentoAgendaPageProps = {
  params: {
    id: string;
  };
};

export const dynamic = 'force-dynamic';

export default function DetentoAgendaPage({ params }: DetentoAgendaPageProps) {
  return <DetentoAgendaView id={params.id} />;
}
