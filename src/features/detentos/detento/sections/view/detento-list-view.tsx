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

import { useListDetento } from '../../hooks';
import { DetentoCard } from '../detento-card';
import { DetentoForm } from '../detento-form';
import { DetentoToolbar } from '../detento-toolbar';
import { getDetentoTableColumns } from '../table-columns';
import { DeleteDetentoDialog } from '../delete-detento-dialog';
import { useDetentoListViewStore } from '../../stores/detento-list-view.store';

import type { IDetento } from '../../types/detento';
import type { IDetentoTableFilters } from '../../types';

export function DetentoListView() {
  const theme = useTheme();
  const { setCurrentDetento, setDetentoToDelete } = useDetentoListViewStore();
  const createDialog = useBoolean();
  const deleteDialog = useBoolean();

  const table = useTable<IDetentoTableFilters>();

  const debouncedSearch = useDebounce(table.search, 500);

  const { detentos, isLoading, isValidating, total } = useListDetento({
    page: table.pagination.page,
    limit: table.pagination.pageSize,
    search: debouncedSearch,
    Sexo: table.filter.Sexo,
  });

  const handleOpenCreate = useCallback(() => {
    setCurrentDetento(null);
    createDialog.onTrue();
  }, [createDialog, setCurrentDetento]);

  const handleOpenEdit = useCallback(
    (detento: IDetento) => {
      setCurrentDetento(detento);
      createDialog.onTrue();
    },
    [createDialog, setCurrentDetento]
  );

  const handleOpenDelete = useCallback(
    (detento: IDetento) => {
      setDetentoToDelete(detento);
      deleteDialog.onTrue();
    },
    [deleteDialog, setDetentoToDelete]
  );

  const columns = useMemo(
    () => getDetentoTableColumns({ handleOpenEdit, handleOpenDelete }),
    [handleOpenDelete, handleOpenEdit]
  );

  console.log(detentos);

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Ficha cadastral"
          links={[{ name: 'Detentos' }, { name: 'Ficha cadastral', href: paths.detento.list }]}
          action={
            <Button
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={handleOpenCreate}
            >
              Novo Detento
            </Button>
          }
        />

        <Card sx={{ mb: { xs: 3, md: 5 } }}>
          <Scrollbar>
            <Stack
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{ py: 2, flexDirection: 'row' }}
            >
              <DetentoCard
                percent={100}
                title="Total"
                total={total}
                value={200}
                icon="solar:user-bold-duotone"
                color={theme.vars.palette.primary.main}
              />
              <DetentoCard
                percent={100}
                title="Homens"
                total={total}
                value={200}
                icon="solar:men-bold-duotone"
                color={theme.vars.palette.info.main}
              />
              <DetentoCard
                percent={100}
                title="Mulheres"
                total={total}
                value={200}
                icon="solar:women-bold-duotone"
                color={theme.vars.palette.success.main}
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
            rows={detentos}
            columns={columns}
            loading={isLoading || isValidating}
            rowCount={total}
            toolbar={DetentoToolbar}
          />
        </Card>
      </DashboardContent>
      <DetentoForm dialog={createDialog} />
      <DeleteDetentoDialog dialog={deleteDialog} />
    </>
  );
}
