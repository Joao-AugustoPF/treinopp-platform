import { AlunoDetailsView } from "src/features/alunos/sections/view/aluno-details-view";

type AlunoDetailsPageProps = {
  params: {
    id: string;
  };
};

export const dynamic = 'force-dynamic';

export default function AlunoDetailsPage({ params }: AlunoDetailsPageProps) {
  return <AlunoDetailsView id={params.id} />;
}
