'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { AvaliacaoNewEditForm } from '../avaliacao-new-edit-form';
import { AvaliacaoPDFDownload, AvaliacaoPDFButton } from '../avaliacao-pdf';
import { useAvaliacaoById } from '../../hooks/use-avaliacao-by-id';

import type { IAvaliacao } from '../../types';

// ----------------------------------------------------------------------

type Props = {
  avaliacaoId: string;
  treinadorId: string;
};

export function AvaliacaoEditView({ avaliacaoId, treinadorId }: Props) {
  const { avaliacao, metrics, isLoading } = useAvaliacaoById(treinadorId, avaliacaoId);
  console.log('metrics: ', metrics);

  const hasMetrics =
    Object.keys(metrics).length > 0 && Object.values(metrics).some((value) => value > 0);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.treinador.avaliacoes(treinadorId)}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Avaliações', href: paths.treinador.avaliacoes(treinadorId) },
          { name: avaliacaoId },
        ]}
        action={
          avaliacao && !isLoading ? (
            hasMetrics ? (
              <AvaliacaoPDFDownload avaliacao={avaliacao} metrics={metrics} />
            ) : (
              <AvaliacaoPDFButton avaliacao={avaliacao} metrics={metrics} />
            )
          ) : null
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <AvaliacaoNewEditForm
        metrics={metrics ?? {}}
        treinadorId={treinadorId}
        currentAvaliacao={avaliacao ?? ({} as IAvaliacao)}
      />
    </DashboardContent>
  );
}
