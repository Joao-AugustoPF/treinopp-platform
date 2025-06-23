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

import { paths } from 'src/routes/paths';

import { StatusTreinador, Especialidade } from '../../types';
import { useListTreinadores, useTreinadorFilters } from '../../hooks';
import { useTreinadorListViewStore } from '../../stores/treinador-list-view.store';
import {
  TreinadorForm,
  TreinadorCard,
  DeleteTreinadorDialog,
  getTreinadorTableColumns,
  TreinadorFiltersDrawer,
  TreinadorFiltersResult,
  TreinadorTableToolbar,
  TreinadorTableFiltersResult,
  TreinadorSearch,
  TreinadorSort,
} from '../';

import type { ITreinador, ITreinadorTableFilters } from '../../types';

export function TreinadorListView() {
  const theme = useTheme();
  const { setCurrentTreinador, setTreinadorToDelete } = useTreinadorListViewStore();
  const createDialog = useBoolean();
  const deleteDialog = useBoolean();
  const viewDialog = useBoolean();
  const filtersDrawer = useBoolean();

  const table = useTable<ITreinadorTableFilters>();
  const filters = useTreinadorFilters();

  const debouncedSearch = useDebounce(table.search, 500);

  const { treinadores, isLoading, isValidating, total } = useListTreinadores({
    page: table.pagination.page,
    limit: table.pagination.pageSize,
    search: debouncedSearch || '',
    status: filters.state.status || '',
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
    (treinador) => treinador.Status === ('ACTIVE' as any)
  ).length;

  const inativosTreinadores = treinadores.filter(
    (treinador) => treinador.Status === ('INACTIVE' as any)
  ).length;

  const pendentesTreinadores = treinadores.filter(
    (treinador) => treinador.Status === ('PENDING' as any)
  ).length;

  const bloqueadosTreinadores = treinadores.filter(
    (treinador) => treinador.Status === ('BLOCKED' as any)
  ).length;

  // Opções para os filtros
  const filterOptions = useMemo(
    () => ({
      status: [
        { value: 'ACTIVE', label: 'Ativo' },
        { value: 'INACTIVE', label: 'Inativo' },
        { value: 'PENDING', label: 'Pendente' },
        { value: 'BLOCKED', label: 'Bloqueado' },
      ],
    }),
    []
  );

  // Opções de ordenação
  const sortOptions = useMemo(
    () => [
      { value: 'Nome', label: 'Nome' },
      { value: 'Status', label: 'Status' },
      { value: 'DataNascimento', label: 'Data de Nascimento' },
      { value: 'CreatedAt', label: 'Data de Cadastro' },
    ],
    []
  );

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
                percent={(pendentesTreinadores / totalTreinadores) * 100 || 0}
                title="Pendentes"
                total={totalTreinadores}
                value={pendentesTreinadores}
                icon="solar:user-block-bold"
                color={theme.vars.palette.warning.main}
              />
              <TreinadorCard
                percent={(bloqueadosTreinadores / totalTreinadores) * 100 || 0}
                title="Bloqueados"
                total={totalTreinadores}
                value={bloqueadosTreinadores}
                icon="solar:user-block-bold"
                color={theme.vars.palette.error.main}
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
            <TreinadorSearch
              redirectPath={(id) => paths.treinador.details(id)}
              options={treinadores}
              loading={isLoading}
              sx={{ flexGrow: 1 }}
            />

            <TreinadorSort
              sort={table.sort[0]?.field || 'Nome'}
              onSort={(value) => table.onChangeSort([{ field: value, sort: 'asc' }])}
              sortOptions={sortOptions}
            />

            <TreinadorFiltersDrawer
              open={filtersDrawer.value}
              onOpen={filtersDrawer.onTrue}
              onClose={filtersDrawer.onFalse}
              canReset={filters.hasActiveFilters()}
              filters={filters}
              options={filterOptions}
            />
          </Stack>

          <TreinadorFiltersResult
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
            rows={treinadores}
            columns={columns}
            loading={isLoading || isValidating}
            rowCount={total}
            toolbar={(props) => (
              <TreinadorTableToolbar {...props} filters={filters} options={filterOptions} />
            )}
          />
        </Card>
      </DashboardContent>
      <TreinadorForm dialog={createDialog} />
      <DeleteTreinadorDialog dialog={deleteDialog} />
      <TreinadorForm dialog={viewDialog} readOnly />
    </>
  );
}
