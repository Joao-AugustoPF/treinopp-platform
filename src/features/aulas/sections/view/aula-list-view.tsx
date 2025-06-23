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

import { AulaForm } from '../aula-form';
import { getAulaTableColumns } from '../table-columns';
import { useListAula, useDeleteAula, useAulaFilters } from '../../hooks';
import { DeleteAulaDialog } from '../delete-aula-dialog';
import { useAulaListViewStore } from '../../stores/aula-list-view.store';
import { AulaFiltersDrawer, AulaFiltersResult, AulaTableToolbar, AulaSort } from '../index';

import type { IAula } from '../../types';

export function AulaListView() {
  const theme = useTheme();
  const createDialog = useBoolean();
  const deleteDialog = useBoolean();
  const filtersDrawer = useBoolean();

  const { setCurrentAula, setAulaToDelete } = useAulaListViewStore();
  const filters = useAulaFilters();

  const table = useTable();
  const debouncedSearch = useDebounce(table.search, 500);

  const { aulas, isLoading, total } = useListAula({
    page: table.pagination.page,
    limit: table.pagination.pageSize,
    search: debouncedSearch,
    tipoAula: filters.state.tipoAula,
    status: filters.state.status,
  });

  const { deleteAula } = useDeleteAula();

  const handleOpenEdit = useCallback(
    (aula: IAula) => {
      setCurrentAula(aula);
      createDialog.onTrue();
    },
    [createDialog, setCurrentAula]
  );

  const handleOpenDelete = useCallback(
    (aula: IAula) => {
      setAulaToDelete(aula);
      deleteDialog.onTrue();
    },
    [deleteDialog, setAulaToDelete]
  );

  const handleCloseEdit = useCallback(() => {
    setCurrentAula(null);
    createDialog.onFalse();
  }, [createDialog, setCurrentAula]);

  const handleCloseDelete = useCallback(() => {
    setAulaToDelete(null);
    deleteDialog.onFalse();
  }, [deleteDialog, setAulaToDelete]);

  const columns = useMemo(
    () => getAulaTableColumns({ handleOpenEdit, handleOpenDelete }),
    [handleOpenEdit, handleOpenDelete]
  );

  // Opções para os filtros
  const filterOptions = useMemo(
    () => ({
      tipoAula: [
        { value: 'yoga', label: 'Yoga' },
        { value: 'funcional', label: 'Funcional' },
        { value: 'outro', label: 'Outro' },
      ],
      status: [
        { value: 'scheduled', label: 'Agendada' },
        { value: 'confirmed', label: 'Confirmada' },
        { value: 'in_progress', label: 'Em Andamento' },
        { value: 'completed', label: 'Concluída' },
        { value: 'cancelled', label: 'Cancelada' },
        { value: 'no_show', label: 'Ausente' },
      ],
    }),
    []
  );

  // Opções de ordenação
  const sortOptions = useMemo(
    () => [
      { value: 'Nome', label: 'Nome' },
      { value: 'TipoAula', label: 'Tipo de Aula' },
      { value: 'DataInicio', label: 'Data de Início' },
      { value: 'Local', label: 'Local' },
      { value: 'Status', label: 'Status' },
      { value: 'CreatedAt', label: 'Data de Cadastro' },
    ],
    []
  );

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Aulas"
          links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Aulas' }]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={createDialog.onTrue}
            >
              Nova Aula
            </Button>
          }
        />

        {/* Filtros e Ordenação */}
        <Card sx={{ mb: 3 }}>
          <Stack
            spacing={2}
            direction={{ xs: 'column', md: 'row' }}
            alignItems={{ xs: 'stretch', md: 'center' }}
            sx={{ p: 2.5 }}
          >
            <AulaSort
              sort={table.sort[0]?.field || 'Nome'}
              onSort={(value) => table.onChangeSort([{ field: value, sort: 'asc' }])}
              sortOptions={sortOptions}
            />

            <AulaFiltersDrawer
              open={filtersDrawer.value}
              onOpen={filtersDrawer.onTrue}
              onClose={filtersDrawer.onFalse}
              canReset={filters.hasActiveFilters()}
              filters={filters}
              options={filterOptions}
            />
          </Stack>

          <AulaFiltersResult
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
            rows={aulas}
            columns={columns}
            loading={isLoading}
            rowCount={total}
            toolbar={(props) => (
              <AulaTableToolbar {...props} filters={filters} options={filterOptions} />
            )}
          />
        </Card>
      </DashboardContent>

      <AulaForm open={createDialog.value} onClose={handleCloseEdit} />

      <DeleteAulaDialog open={deleteDialog.value} onClose={handleCloseDelete} />
    </>
  );
}
