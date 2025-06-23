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
import { Scrollbar } from 'src/components/scrollbar';
import { DataGrid } from 'src/components/data-grid/data-grid';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { useListAcademias, useAcademiaFilters } from '../../hooks';
import { AcademiaCard } from '../academia-card';
import { AcademiaForm } from '../academia-form';
import { getAcademiaTableColumns } from './table-columns';
import { DeleteAcademiaDialog } from '../delete-academia-dialog';
import { useAcademiaListViewStore } from '../../stores/academia-list-view.store';
import {
  AcademiaFiltersDrawer,
  AcademiaFiltersResult,
  AcademiaTableToolbar,
  AcademiaSort,
} from '../index';

import type { IAcademia } from '../../types/academia';

export function AcademiaListView() {
  const theme = useTheme();
  const { setCurrentAcademia, setAcademiaToDelete } = useAcademiaListViewStore();
  const createDialog = useBoolean();
  const deleteDialog = useBoolean();
  const filtersDrawer = useBoolean();

  const filters = useAcademiaFilters();
  const table = useTable();
  const debouncedSearch = useDebounce(table.search, 500);

  const { academias, isLoading, total } = useListAcademias({
    page: table.pagination.page,
    limit: table.pagination.pageSize,
    search: debouncedSearch,
    estado: filters.state.estado,
    cidade: filters.state.cidade,
  });

  const handleOpenCreate = useCallback(() => {
    setCurrentAcademia(null);
    createDialog.onTrue();
  }, [createDialog, setCurrentAcademia]);

  const handleOpenEdit = useCallback(
    (academia: IAcademia) => {
      setCurrentAcademia(academia);
      createDialog.onTrue();
    },
    [createDialog, setCurrentAcademia]
  );

  const handleOpenDelete = useCallback(
    (academia: IAcademia) => {
      setAcademiaToDelete(academia);
      deleteDialog.onTrue();
    },
    [deleteDialog, setAcademiaToDelete]
  );

  const columns = useMemo(
    () => getAcademiaTableColumns({ handleOpenEdit, handleOpenDelete }),
    [handleOpenDelete, handleOpenEdit]
  );

  // Opções para os filtros
  const filterOptions = useMemo(
    () => ({
      estado: [
        { value: 'SP', label: 'São Paulo' },
        { value: 'RJ', label: 'Rio de Janeiro' },
        { value: 'MG', label: 'Minas Gerais' },
        { value: 'BA', label: 'Bahia' },
        { value: 'PR', label: 'Paraná' },
      ],
      cidade: [
        { value: 'São Paulo', label: 'São Paulo' },
        { value: 'Rio de Janeiro', label: 'Rio de Janeiro' },
        { value: 'Belo Horizonte', label: 'Belo Horizonte' },
        { value: 'Salvador', label: 'Salvador' },
        { value: 'Curitiba', label: 'Curitiba' },
      ],
    }),
    []
  );

  // Opções de ordenação
  const sortOptions = useMemo(
    () => [
      { value: 'Name', label: 'Nome' },
      { value: 'AddressCity', label: 'Cidade' },
      { value: 'AddressState', label: 'Estado' },
      { value: 'PaymentGateway', label: 'Gateway de Pagamento' },
      { value: 'CreatedAt', label: 'Data de Cadastro' },
    ],
    []
  );

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Cadastro de Academias"
          links={[
            { name: 'Academias' },
            { name: 'Cadastro de Academias', href: paths.academia.list },
          ]}
          action={
            <Button
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={handleOpenCreate}
            >
              Nova Academia
            </Button>
          }
        />

        <Card sx={{ mb: { xs: 3, md: 5 } }}>
          <Scrollbar>
            <Stack
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{ py: 2, flexDirection: 'row' }}
            >
              <AcademiaCard
                percent={100}
                title="Total"
                total={total}
                value={total}
                icon="solar:buildings-bold"
                color={theme.vars.palette.primary.main}
              />
              <AcademiaCard
                percent={100}
                title="Ativas"
                total={total}
                value={Math.floor(total * 0.8)}
                icon="solar:check-circle-bold"
                color={theme.vars.palette.info.main}
              />
              <AcademiaCard
                percent={100}
                title="Inativas"
                total={total}
                value={Math.floor(total * 0.2)}
                icon="solar:close-circle-bold"
                color={theme.vars.palette.error.main}
              />
            </Stack>
          </Scrollbar>
        </Card>

        {/* Filtros e Ordenação */}
        <Card sx={{ mb: 3 }}>
          <Stack
            spacing={2}
            direction={{ xs: 'column', md: 'row' }}
            alignItems={{ xs: 'stretch', md: 'center' }}
            sx={{ p: 2.5 }}
          >
            <AcademiaSort
              sort={table.sort[0]?.field || 'Name'}
              onSort={(value) => table.onChangeSort([{ field: value, sort: 'asc' }])}
              sortOptions={sortOptions}
            />

            <AcademiaFiltersDrawer
              open={filtersDrawer.value}
              onOpen={filtersDrawer.onTrue}
              onClose={filtersDrawer.onFalse}
              canReset={filters.hasActiveFilters()}
              filters={filters}
              options={filterOptions}
            />
          </Stack>

          <AcademiaFiltersResult
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
            rows={academias}
            columns={columns}
            loading={isLoading}
            rowCount={total}
            toolbar={(props) => (
              <AcademiaTableToolbar {...props} filters={filters} options={filterOptions} />
            )}
          />
        </Card>
      </DashboardContent>
      <AcademiaForm dialog={createDialog} />
      <DeleteAcademiaDialog dialog={deleteDialog} />
    </>
  );
}
