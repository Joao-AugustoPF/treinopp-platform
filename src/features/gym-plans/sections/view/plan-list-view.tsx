'use client';

import { useMemo, useCallback } from 'react';
import { useBoolean, useDebounce } from 'minimal-shared/hooks';

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { Stack, Divider, useTheme } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useTable } from 'src/hooks/use-table';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { DataGrid } from 'src/components/data-grid/data-grid';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { useAuthContext } from 'src/auth/hooks';

import { PlanForm } from '../plan-form';
import { PlanCard } from '../plan-card';
import { useListPlans, usePlanFilters } from '../../hooks';
import { getPlanTableColumns } from '../table-columns';
import { DeletePlanDialog } from '../delete-plan-dialog';
import { usePlanListViewStore } from '../../stores/plan-list-view.store';
import {
  PlanFiltersDrawer,
  PlanFiltersResult,
  PlanTableToolbar,
  PlanTableFiltersResult,
  PlanSearch,
  PlanSort,
} from '../index';

import type { IPlan } from '../../types/plan';

export function PlanListView() {
  const theme = useTheme();
  const { currentPlan, setCurrentPlan, setPlanToDelete } = usePlanListViewStore();
  const createDialog = useBoolean();
  const deleteDialog = useBoolean();
  const filtersDrawer = useBoolean();
  const { user } = useAuthContext();

  const profile = user?.profile;

  const table = useTable();
  const filters = usePlanFilters();

  const debouncedSearch = useDebounce(table.search, 500);

  // Opções para os filtros
  const filterOptions = useMemo(
    () => ({
      duracao: [
        { value: '30', label: 'Até 30 dias', min: 1, max: 30 },
        { value: '60', label: '31-60 dias', min: 31, max: 60 },
        { value: '90', label: '61-90 dias', min: 61, max: 90 },
        { value: '180', label: '91-180 dias', min: 91, max: 180 },
        { value: '365', label: '181-365 dias', min: 181, max: 365 },
      ],
    }),
    []
  );

  // Obter range de duração baseado no filtro selecionado
  const duracaoRange = useMemo(() => {
    if (!filters.state.duracao) return null;
    return filters.getDuracaoRange(filters.state.duracao);
  }, [filters.state.duracao, filters.getDuracaoRange]);

  const { plans, isLoading, total } = useListPlans({
    page: table.pagination.page,
    limit: table.pagination.pageSize,
    search: debouncedSearch,
    duracao: filters.state.duracao,
    duracaoMin: duracaoRange?.min,
    duracaoMax: duracaoRange?.max,
  });

  const handleOpenCreate = useCallback(() => {
    setCurrentPlan(null);
    createDialog.onTrue();
  }, [createDialog, setCurrentPlan]);

  const handleOpenEdit = useCallback(
    (plan: IPlan) => {
      setCurrentPlan(plan);
      createDialog.onTrue();
    },
    [createDialog, setCurrentPlan]
  );

  const handleOpenDelete = useCallback(
    (plan: IPlan) => {
      setPlanToDelete(plan);
      deleteDialog.onTrue();
    },
    [deleteDialog, setPlanToDelete]
  );

  const columns = useMemo(
    () =>
      getPlanTableColumns({
        handleOpenEdit,
        handleOpenDelete,
      }),
    [handleOpenEdit, handleOpenDelete]
  );

  // Opções de ordenação
  const sortOptions = useMemo(
    () => [
      { value: 'Nome', label: 'Nome' },
      { value: 'Valor', label: 'Valor' },
      { value: 'Duracao', label: 'Duração' },
      { value: 'CreatedAt', label: 'Data de Cadastro' },
    ],
    []
  );

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Planos"
          links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Planos' }]}
          action={
            <Button
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={handleOpenCreate}
            >
              Novo Plano
            </Button>
          }
        />

        <Card sx={{ mb: { xs: 3, md: 5 } }}>
          <Stack
            divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
            sx={{ py: 2, flexDirection: 'row' }}
          >
            <PlanCard
              percent={100}
              title="Total"
              total={total}
              value={total}
              icon="solar:document-text-bold-duotone"
              color={theme.vars.palette.primary.main}
            />
          </Stack>
        </Card>

        {/* Filtros e Busca */}
        <Card sx={{ mb: 3 }}>
          <Stack
            spacing={2}
            direction={{ xs: 'column', md: 'row' }}
            alignItems={{ xs: 'stretch', md: 'center' }}
            sx={{ p: 2.5 }}
          >
            {/* <PlanSearch
              redirectPath={paths.planos.details}
              options={plans}
              loading={isLoading}
              sx={{ flexGrow: 1 }}
            /> */}

            <PlanSort
              sort={table.sort[0]?.field || 'Nome'}
              onSort={(value) => table.onChangeSort([{ field: value, sort: 'asc' }])}
              sortOptions={sortOptions}
            />

            <PlanFiltersDrawer
              open={filtersDrawer.value}
              onOpen={filtersDrawer.onTrue}
              onClose={filtersDrawer.onFalse}
              canReset={filters.hasActiveFilters()}
              filters={filters}
              options={filterOptions}
            />
          </Stack>

          <PlanFiltersResult
            filters={filters}
            totalResults={total}
            options={filterOptions}
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
            rows={plans}
            columns={columns}
            loading={isLoading}
            rowCount={total}
            toolbar={(props) => (
              <PlanTableToolbar {...props} filters={filters} options={filterOptions} />
            )}
          />
        </Card>
      </DashboardContent>

      <PlanForm
        open={createDialog.value}
        onClose={() => {
          setCurrentPlan(null);
          createDialog.onFalse();
        }}
        currentPlan={currentPlan}
        tenantId={profile?.tenantId ?? ''}
      />

      <DeletePlanDialog open={deleteDialog.value} onClose={deleteDialog.onFalse} />
    </>
  );
}
