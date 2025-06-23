'use client';

import { useMemo, useCallback } from 'react';
import { useBoolean, useDebounce } from 'minimal-shared/hooks';

import Button from '@mui/material/Button';
import { Card, Stack, Divider, useTheme } from '@mui/material';

import { useTable } from 'src/hooks/use-table';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { DataGrid } from 'src/components/data-grid/data-grid';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { StatusTreinador } from '../../types';
import { useListTreinadores } from '../../hooks';
import { TreinadorToolbar } from '../treinador-toolbar';
import { useTreinadorListViewStore } from '../../stores/treinador-list-view.store';
import { TreinadorForm, TreinadorCard, DeleteTreinadorDialog, getTreinadorTableColumns } from '../';

import type { ITreinador, ITreinadorTableFilters } from '../../types';

export function TreinadorAvaliacaoListView() {
  const theme = useTheme();
  const { setCurrentTreinador, setTreinadorToDelete } = useTreinadorListViewStore();
  const createDialog = useBoolean();
  const deleteDialog = useBoolean();
  const viewDialog = useBoolean();

  const table = useTable<ITreinadorTableFilters>();

  const debouncedSearch = useDebounce(table.search, 500);

  const { treinadores, isLoading, isValidating, total } = useListTreinadores({
    page: table.pagination.page,
    limit: table.pagination.pageSize,
    search: debouncedSearch,
    status: table.filter.status,
  });

  const handleOpenCreate = useCallback(() => {
    setCurrentTreinador(null);
    createDialog.onTrue();
  }, [createDialog, setCurrentTreinador]);

  const handleOpenEdit = useCallback(
    (treinador: ITreinador) => {
      setCurrentTreinador(treinador);
      createDialog.onTrue();
    },
    [createDialog, setCurrentTreinador]
  );

  const handleOpenDelete = useCallback(
    (treinador: ITreinador) => {
      setTreinadorToDelete(treinador);
      deleteDialog.onTrue();
    },
    [deleteDialog, setTreinadorToDelete]
  );

  const handleOpenView = useCallback(
    (treinador: ITreinador) => {
      setCurrentTreinador(treinador);
      viewDialog.onTrue();
    },
    [viewDialog, setCurrentTreinador]
  );

  const columns = useMemo(
    () => getTreinadorTableColumns({ handleOpenEdit, handleOpenDelete, handleOpenView }),
    [handleOpenDelete, handleOpenEdit, handleOpenView]
  );

  // Contagem de treinadores por status
  const totalTreinadores = treinadores.length;

  const ativosTreinadores = treinadores.filter(
    (treinador) => treinador.Status === 'Ativo'
  ).length;

  const inativosTreinadores = treinadores.filter(
    (treinador) => treinador.Status === 'Inativo'
  ).length;

  const feriasTreinadores = treinadores.filter(
    (treinador) => treinador.Status === 'Férias'
  ).length;

  console.log(treinadores);

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Treinadores"
          links={[{ name: 'Dashboard', href: '/dashboard' }, { name: 'Treinadores' }]}
          action={
            <Button
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={handleOpenCreate}
            >
              Novo Treinador
            </Button>
          }
        />

        <Card sx={{ mb: { xs: 3, md: 5 } }}>
          <Scrollbar>
            <Stack
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{ py: 2, flexDirection: 'row' }}
            >
              <TreinadorCard
                percent={100}
                title="Total"
                total={totalTreinadores}
                value={totalTreinadores}
                icon="solar:user-bold-duotone"
                color={theme.vars.palette.primary.main}
              />
              <TreinadorCard
                percent={(ativosTreinadores / totalTreinadores) * 100 || 0}
                title="Ativos"
                total={totalTreinadores}
                value={ativosTreinadores}
                icon="solar:user-check-bold-duotone"
                color={theme.vars.palette.success.main}
              />
              <TreinadorCard
                percent={(inativosTreinadores / totalTreinadores) * 100 || 0}
                title="Inativos"
                total={totalTreinadores}
                value={inativosTreinadores}
                icon="solar:user-cross-bold-duotone"
                color={theme.vars.palette.error.main}
              />
              <TreinadorCard
                percent={(feriasTreinadores / totalTreinadores) * 100 || 0}
                title="Em Férias"
                total={totalTreinadores}
                value={feriasTreinadores}
                icon="solar:sun-2-bold-duotone"
                color={theme.vars.palette.warning.main}
              />
            </Stack>
          </Scrollbar>
        </Card>

        <Card
          sx={{
            minHeight: 640,
            flexGrow: { md: 1 },
            display: { md: 'flex' },
            height: { xs: 800, md: '1px' },
            flexDirection: { md: 'column' },
          }}
        >
          <DataGrid
            {...table}
            getRowId={(row) => row.Id}
            rows={treinadores}
            columns={columns}
            loading={isLoading || isValidating}
            rowCount={total}
            toolbar={TreinadorToolbar}
          />
        </Card>
      </DashboardContent>
      <TreinadorForm dialog={createDialog} />
      <DeleteTreinadorDialog dialog={deleteDialog} />
      <TreinadorForm dialog={viewDialog} readOnly />
    </>
  );
}
