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

import { useListUnidade } from '../../hooks';
import { UnidadeCard } from '../unidade-card';
import { UnidadeForm } from '../unidade-form';
import { UnidadeToolbar } from '../unidade-toolbar';
import { getUnidadeTableColumns } from './table-columns';
import { DeleteUnidadeDialog } from '../delete-unidade-dialog';
import { useUnidadeListViewStore } from '../../stores/unidade-list-view.store';

import type { IUnidade } from '../../types/unidade';
import type { IUnidadeTableFilters } from '../../types';

export function UnidadeListView() {
  const theme = useTheme();
  const { setCurrentUnidade, setUnidadeToDelete } = useUnidadeListViewStore();
  const createDialog = useBoolean();
  const deleteDialog = useBoolean();

  const table = useTable<IUnidadeTableFilters>();

  const debouncedSearch = useDebounce(table.search, 500);

  const { unidades, isLoading, isValidating, total } = useListUnidade({
    page: table.pagination.page,
    limit: table.pagination.pageSize,
    search: debouncedSearch,
    Cidade: table.filter.Cidade,
    Estado: table.filter.Estado,
  });

  const handleOpenCreate = useCallback(() => {
    setCurrentUnidade(null);
    createDialog.onTrue();
  }, [createDialog, setCurrentUnidade]);

  const handleOpenEdit = useCallback(
    (unidade: IUnidade) => {
      setCurrentUnidade(unidade);
      createDialog.onTrue();
    },
    [createDialog, setCurrentUnidade]
  );

  const handleOpenDelete = useCallback(
    (unidade: IUnidade) => {
      setUnidadeToDelete(unidade);
      deleteDialog.onTrue();
    },
    [deleteDialog, setUnidadeToDelete]
  );

  const columns = useMemo(
    () => getUnidadeTableColumns({ handleOpenEdit, handleOpenDelete }),
    [handleOpenDelete, handleOpenEdit]
  );

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Cadastro de Unidades"
          links={[{ name: 'Unidades' }, { name: 'Cadastro de Unidades', href: paths.unidade.list }]}
          action={
            <Button
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={handleOpenCreate}
            >
              Nova Unidade
            </Button>
          }
        />

        <Card sx={{ mb: { xs: 3, md: 5 } }}>
          <Scrollbar>
            <Stack
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{ py: 2, flexDirection: 'row' }}
            >
              <UnidadeCard
                percent={100}
                title="Total"
                total={total}
                value={total}
                icon="solar:buildings-bold"
                color={theme.vars.palette.primary.main}
              />
              <UnidadeCard
                percent={100}
                title="Ativas"
                total={total}
                value={Math.floor(total * 0.8)}
                icon="solar:check-circle-bold"
                color={theme.vars.palette.info.main}
              />
              <UnidadeCard
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
            rows={unidades}
            columns={columns}
            loading={isLoading || isValidating}
            rowCount={total}
            toolbar={UnidadeToolbar}
          />
        </Card>
      </DashboardContent>
      <UnidadeForm dialog={createDialog} />
      <DeleteUnidadeDialog dialog={deleteDialog} />
    </>
  );
}
