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

import { StatusAvaliacao } from '../../types';
import { useListAvaliacoes, useAvaliacaoFilters } from '../../hooks';
import { AvaliacaoToolbar } from '../avaliacao-toolbar';
import { useAvaliacaoListViewStore } from '../../stores/avaliacao-list-view.store';
import { AvaliacaoCard, AvaliacaoForm, DeleteAvaliacaoDialog, getAvaliacaoTableColumns } from '../';
import {
  AvaliacaoFiltersDrawer,
  AvaliacaoFiltersResult,
  AvaliacaoTableToolbar,
  AvaliacaoTableFiltersResult,
  AvaliacaoSearch,
  AvaliacaoSort,
} from '../';

import type { IAvaliacao, IAvaliacaoTableFilters } from '../../types';
import { useAuthContext } from 'src/auth/hooks';
import { paths } from 'src/routes/paths';

type AvaliacaoListViewProps = { id: string };

export function AvaliacaoListView({ id }: AvaliacaoListViewProps) {
  const theme = useTheme();
  const { currentAvaliacao, setCurrentAvaliacao, setAvaliacaoToDelete } =
    useAvaliacaoListViewStore();
  const createDialog = useBoolean();
  const deleteDialog = useBoolean();
  const viewDialog = useBoolean();
  const editTimeDialog = useBoolean();
  const filtersDrawer = useBoolean();

  const table = useTable<IAvaliacaoTableFilters>();
  const filters = useAvaliacaoFilters();

  const debouncedSearch = useDebounce(table.search, 500);

  const { avaliacoes, isLoading, isValidating, total } = useListAvaliacoes({
    page: (table.pagination.page || 0) + 1,
    limit: table.pagination.pageSize || 10,
    search: debouncedSearch,
    status: filters.state.status,
    dataInicio: filters.state.dataInicio,
    dataFim: filters.state.dataFim,
    treinadorId: id,
  });

  const handleOpenCreate = useCallback(() => {
    setCurrentAvaliacao(null);
    createDialog.onTrue();
  }, [createDialog, setCurrentAvaliacao]);

  const handleOpenEdit = useCallback(
    (avaliacao: IAvaliacao) => {
      setCurrentAvaliacao(avaliacao);
      createDialog.onTrue();
    },
    [createDialog, setCurrentAvaliacao]
  );

  const handleOpenEditTime = useCallback(
    (avaliacao: IAvaliacao) => {
      setCurrentAvaliacao(avaliacao);
      createDialog.onTrue();
    },
    [createDialog, setCurrentAvaliacao]
  );

  const handleOpenDelete = useCallback(
    (avaliacao: IAvaliacao) => {
      setAvaliacaoToDelete(avaliacao);
      deleteDialog.onTrue();
    },
    [deleteDialog, setAvaliacaoToDelete]
  );

  const handleOpenView = useCallback(
    (avaliacao: IAvaliacao) => {
      setCurrentAvaliacao(avaliacao);
      viewDialog.onTrue();
    },
    [viewDialog, setCurrentAvaliacao]
  );

  const columns = useMemo(
    () =>
      getAvaliacaoTableColumns({
        handleOpenEdit,
        handleOpenDelete,
        handleOpenView,
        handleOpenEditTime,
      }),
    [handleOpenDelete, handleOpenEdit, handleOpenView, handleOpenEditTime]
  );

  // Contagem de avaliações por status
  const totalAvaliacoes = avaliacoes.length;

  const agendadasAvaliacoes = avaliacoes.filter(
    (avaliacao) => avaliacao.Status === StatusAvaliacao.AGENDADA
  ).length;

  const canceladasAvaliacoes = avaliacoes.filter(
    (avaliacao) => avaliacao.Status === StatusAvaliacao.CANCELADA
  ).length;

  const realizadasAvaliacoes = avaliacoes.filter(
    (avaliacao) => avaliacao.Status === StatusAvaliacao.REALIZADA
  ).length;

  // Opções para os filtros
  const filterOptions = useMemo(
    () => ({
      status: [
        { value: StatusAvaliacao.AGENDADA, label: 'Agendada' },
        { value: StatusAvaliacao.CANCELADA, label: 'Cancelada' },
        { value: StatusAvaliacao.REALIZADA, label: 'Realizada' },
      ],
    }),
    []
  );

  // Opções de ordenação
  const sortOptions = useMemo(
    () => [
      { value: 'PerfilMembroId.Nome', label: 'Aluno' },
      { value: 'Status', label: 'Status' },
      { value: 'SlotAvaliacaoId.DataInicio', label: 'Data/Hora' },
      { value: 'CreatedAt', label: 'Data de Criação' },
    ],
    []
  );

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Avaliações"
          links={[{ name: 'Dashboard', href: '/dashboard' }, { name: 'Avaliações' }]}
          action={
            <Button
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={handleOpenCreate}
            >
              Nova Avaliação
            </Button>
          }
        />

        <Card sx={{ mb: { xs: 3, md: 5 } }}>
          <Scrollbar>
            <Stack
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{ py: 2, flexDirection: 'row' }}
            >
              <AvaliacaoCard
                percent={100}
                title="Total"
                total={totalAvaliacoes}
                value={totalAvaliacoes}
                icon="solar:clipboard-check-bold-duotone"
                color={theme.vars.palette.primary.main}
              />
              <AvaliacaoCard
                percent={(agendadasAvaliacoes / totalAvaliacoes) * 100 || 0}
                title="Agendadas"
                total={totalAvaliacoes}
                value={agendadasAvaliacoes}
                icon="solar:calendar-mark-bold-duotone"
                color={theme.vars.palette.info.main}
              />
              <AvaliacaoCard
                percent={(canceladasAvaliacoes / totalAvaliacoes) * 100 || 0}
                title="Canceladas"
                total={totalAvaliacoes}
                value={canceladasAvaliacoes}
                icon="solar:close-circle-bold-duotone"
                color={theme.vars.palette.error.main}
              />
              <AvaliacaoCard
                percent={(realizadasAvaliacoes / totalAvaliacoes) * 100 || 0}
                title="Realizadas"
                total={totalAvaliacoes}
                value={realizadasAvaliacoes}
                icon="solar:check-circle-bold-duotone"
                color={theme.vars.palette.success.main}
              />
            </Stack>
          </Scrollbar>
        </Card>

        {/* Filtros e Busca */}
        <Card sx={{ mb: 3 }}>
          <Stack
            spacing={2}
            direction={{ xs: 'column', md: 'row' }}
            alignItems={{ xs: 'stretch', md: 'center' }}
            sx={{ p: 2.5 }}
          >
            <AvaliacaoSearch
              redirectPath={(avaliacaoId) => paths.treinador.avaliacao(id, avaliacaoId)}
              options={avaliacoes}
              loading={isLoading}
              sx={{ flexGrow: 1 }}
            />

            <AvaliacaoSort
              sort={table.sort[0]?.field || 'PerfilMembroId.Nome'}
              onSort={(value) => table.onChangeSort([{ field: value, sort: 'asc' }])}
              sortOptions={sortOptions}
            />

            <AvaliacaoFiltersDrawer
              open={filtersDrawer.value}
              onOpen={filtersDrawer.onTrue}
              onClose={filtersDrawer.onFalse}
              canReset={filters.hasActiveFilters()}
              filters={filters}
              options={filterOptions}
            />
          </Stack>

          <AvaliacaoFiltersResult
            filters={filters}
            totalResults={total}
            sx={{ px: 2.5, pb: 2.5 }}
          />
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
            rows={avaliacoes}
            columns={columns}
            loading={isLoading || isValidating}
            rowCount={total}
            toolbar={(props) => (
              <AvaliacaoTableToolbar {...props} filters={filters} options={filterOptions} />
            )}
          />
        </Card>
      </DashboardContent>

      <AvaliacaoForm
        open={createDialog.value}
        onClose={() => {
          setCurrentAvaliacao(null);
          createDialog.onFalse();
        }}
        currentAvaliacao={currentAvaliacao}
        treinadorId={id}
      />

      <DeleteAvaliacaoDialog treinadorId={id} dialog={deleteDialog} />
    </>
  );
}
