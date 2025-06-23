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

import { useListTreino } from '../hooks';
import { TreinoForm } from './treino-form';
import { TreinoCard } from './treino-card';
// import { TreinoToolbar } from './treino-toolbar';
import { getTreinoTableColumns } from './table-columns';
import { DeleteTreinoDialog } from './delete-treino-dialog';
import { useTreinoListViewStore } from '../stores/treino-list-view.store';

import type { ITreino, ITreinoTableFilters } from '../types';

export function TreinoListView() {
  const theme = useTheme();
  const { setCurrentTreino, setTreinoToDelete } = useTreinoListViewStore();
  const createDialog = useBoolean();
  const deleteDialog = useBoolean();

  const table = useTable<ITreinoTableFilters>();

  const debouncedSearch = useDebounce(table.search, 500);

  const { treinos, isLoading, isValidating, total } = useListTreino({
    page: table.pagination.page,
    limit: table.pagination.pageSize,
    search: debouncedSearch,
    TipoTreino: table.filter.TipoTreino,
  });

  const handleOpenCreate = useCallback(() => {
    setCurrentTreino(null);
    createDialog.onTrue();
  }, [createDialog, setCurrentTreino]);

  const handleOpenEdit = useCallback(
    (treino: ITreino) => {
      setCurrentTreino(treino);
      createDialog.onTrue();
    },
    [createDialog, setCurrentTreino]
  );

  const handleOpenDelete = useCallback(
    (treino: ITreino) => {
      setTreinoToDelete(treino);
      deleteDialog.onTrue();
    },
    [deleteDialog, setTreinoToDelete]
  );

  const columns = useMemo(
    () => getTreinoTableColumns({ handleOpenEdit, handleOpenDelete }),
    [handleOpenDelete, handleOpenEdit]
  );

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Treinos"
          links={[{ name: 'Treinos' }, { name: 'Lista', href: paths.treino.list }]}
          action={
            <Button
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={handleOpenCreate}
            >
              Novo Treino
            </Button>
          }
        />

        <Card sx={{ mb: { xs: 3, md: 5 } }}>
          <Scrollbar>
            <Stack
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{ py: 2, flexDirection: 'row' }}
            >
              <TreinoCard
                percent={100}
                title="Total"
                total={total}
                value={total}
                icon="solar:dumbbell-bold-duotone"
                color={theme.vars.palette.primary.main}
              />
              <TreinoCard
                percent={100}
                title="Força"
                total={total}
                value={treinos.filter((t) => t.TipoTreino === 'Força').length}
                icon="solar:dumbbell-bold-duotone"
                color={theme.vars.palette.success.main}
              />
              <TreinoCard
                percent={100}
                title="Cardio"
                total={total}
                value={treinos.filter((t) => t.TipoTreino === 'Cardio').length}
                icon="solar:heart-pulse-bold-duotone"
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
          {/* <TreinoToolbar
            filters={{ name: table.search }}
            onFilters={(name, value) => {
              if (name === 'name') {
                table.onChangeFilters({ ...table.filter, logicOperator });
              }
            }}
          /> */}

          <DataGrid
            {...table}
            rows={treinos}
            columns={columns}
            loading={isLoading || isValidating}
            rowCount={total}
          />
        </Card>
      </DashboardContent>
      <TreinoForm dialog={createDialog} />
      <DeleteTreinoDialog dialog={deleteDialog} />
    </>
  );
}
