import { AcademiaDetailsView } from 'src/features/academias/academia/sections/view/academia-details-view';


type AcademiaDetailsPageProps = {
  params: {
    id: string;
  };
};

export const dynamic = 'force-dynamic';

export default function AcademiaDetailsPage({ params }: AcademiaDetailsPageProps) {
  return (
      <AcademiaDetailsView id={params.id} />
  );
}
