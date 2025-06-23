'use client';

import { useMemo, useCallback, useEffect } from 'react';
import { useBoolean, useDebounce } from 'minimal-shared/hooks';

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { Stack, Divider, useTheme, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useTable } from 'src/hooks/use-table';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { DataGrid } from 'src/components/data-grid/data-grid';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// import { NotificacaoForm } from '../notificacao-form';
import { useListNotificacoes, useDeleteNotificacao, useNotificacaoFilters } from '../../hooks';
import { getNotificacaoTableColumns } from '../table-columns';
import { useNotificacaoListViewStore } from '../../stores/notificacao-list-view.store';
import { NotificacaoTableToolbar } from '../index';

import type { INotificacao, INotificacaoTableFilters } from '../../types/notificacao';
import { NotificacaoTipo } from '../../types/notificacao';
import { NotificacaoCard } from '../notificacao-card';
import { NotificacaoSort } from '../notificacao-sort';
import { NotificacaoFiltersResult } from '../notificacao-filters-result';
import { NotificacaoFiltersDrawer } from '../notificacao-filters-drawer';
import { NotificacaoForm } from '../notificacao-form';
import { DeleteNotificacaoDialog } from '../delete-notificacao-dialog';

// Notification list view component
export function NotificacaoListView() {
  const theme = useTheme();
  const { setCurrentNotificacao, setNotificacaoToDelete, currentNotificacao } =
    useNotificacaoListViewStore();

  const createDialog = useBoolean();
  const deleteDialog = useBoolean();
  const filtersDrawer = useBoolean();

  const table = useTable<INotificacaoTableFilters>();
  const filters = useNotificacaoFilters();

  const debouncedSearch = useDebounce(table.search, 500);

  const { notificacoes, isLoading, isValidating, total } = useListNotificacoes({
    page: table.pagination.page || 0,
    limit: table.pagination.pageSize || 10,
    search: debouncedSearch || '',
    tipo: filters.state.tipo || '',
  });

  // Calcular estatísticas baseadas nos dados reais
  const stats = useMemo(() => {
    const info = notificacoes.filter(
      (notificacao: INotificacao) => notificacao.Tipo === NotificacaoTipo.INFO
    ).length;
    const success = notificacoes.filter(
      (notificacao: INotificacao) => notificacao.Tipo === NotificacaoTipo.SUCCESS
    ).length;
    const warning = notificacoes.filter(
      (notificacao: INotificacao) => notificacao.Tipo === NotificacaoTipo.WARNING
    ).length;
    const error = notificacoes.filter(
      (notificacao: INotificacao) => notificacao.Tipo === NotificacaoTipo.ERROR
    ).length;

    return {
      total: notificacoes.length,
      info,
      success,
      warning,
      error,
    };
  }, [notificacoes]);

  const handleOpenCreate = useCallback(() => {
    setCurrentNotificacao(null);
    createDialog.onTrue();
  }, [createDialog, setCurrentNotificacao]);

  const handleOpenEdit = useCallback(
    (notificacao: INotificacao) => {
      setCurrentNotificacao(notificacao);
      createDialog.onTrue();
    },
    [createDialog, setCurrentNotificacao]
  );

  const handleOpenDelete = useCallback(
    (notificacao: INotificacao) => {
      setNotificacaoToDelete(notificacao);
      deleteDialog.onTrue();
    },
    [deleteDialog, setNotificacaoToDelete]
  );

  const columns = useMemo(
    () =>
      getNotificacaoTableColumns({
        handleOpenEdit,
        handleOpenDelete,
      }),
    [handleOpenDelete, handleOpenEdit]
  );

  // Opções para os filtros
  const filterOptions = useMemo(
    () => ({
      tipo: [
        { value: 'info', label: 'Informação' },
        { value: 'success', label: 'Sucesso' },
        { value: 'warning', label: 'Aviso' },
        { value: 'error', label: 'Erro' },
      ],
    }),
    []
  );

  // Opções de ordenação
  const sortOptions = useMemo(
    () => [
      { value: 'Titulo', label: 'Título' },
      { value: 'Tipo', label: 'Tipo' },
      { value: 'CreatedAt', label: 'Data de Criação' },
    ],
    []
  );

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Notificações"
          links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Notificações' }]}
          action={
            <Button
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={handleOpenCreate}
            >
              Nova Notificação
            </Button>
          }
        />

        <Card sx={{ mb: { xs: 3, md: 5 } }}>
          <Scrollbar>
            <Stack
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{ py: 2, flexDirection: 'row' }}
            >
              <NotificacaoCard
                percent={100}
                title="Total"
                total={total}
                value={stats.total}
                icon="solar:bell-bold"
                color={theme.vars.palette.primary.main}
              />
              <NotificacaoCard
                percent={stats.total > 0 ? Math.round((stats.info / stats.total) * 100) : 0}
                title="Informação"
                total={stats.total}
                value={stats.info}
                icon="solar:info-circle-bold-duotone"
                color={theme.vars.palette.info.main}
              />
              <NotificacaoCard
                percent={stats.total > 0 ? Math.round((stats.success / stats.total) * 100) : 0}
                title="Sucesso"
                total={stats.total}
                value={stats.success}
                icon="solar:check-circle-bold-duotone"
                color={theme.vars.palette.success.main}
              />
              <NotificacaoCard
                percent={stats.total > 0 ? Math.round((stats.warning / stats.total) * 100) : 0}
                title="Aviso"
                total={stats.total}
                value={stats.warning}
                icon="solar:shield-warning-bold"
                color={theme.vars.palette.warning.main}
              />
              <NotificacaoCard
                percent={stats.total > 0 ? Math.round((stats.error / stats.total) * 100) : 0}
                title="Erro"
                total={stats.total}
                value={stats.error}
                icon="solar:close-circle-bold-duotone"
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
            <NotificacaoSort
              sort={table.sort[0]?.field || 'Nome'}
              onSort={(value) => table.onChangeSort([{ field: value, sort: 'asc' }])}
              sortOptions={sortOptions}
            />

            <NotificacaoFiltersDrawer
              open={filtersDrawer.value}
              onOpen={filtersDrawer.onTrue}
              onClose={filtersDrawer.onFalse}
              canReset={filters.hasActiveFilters()}
              filters={filters}
              options={filterOptions}
            />
          </Stack>

          <NotificacaoFiltersResult
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
            rows={notificacoes}
            columns={columns}
            loading={isLoading || isValidating}
            rowCount={total}
            toolbar={(props) => (
              <NotificacaoTableToolbar {...props} filters={filters} options={filterOptions} />
            )}
          />
        </Card>
      </DashboardContent>

      <NotificacaoForm
        open={createDialog.value}
        onClose={createDialog.onFalse}
        currentNotificacao={currentNotificacao}
      />

      <DeleteNotificacaoDialog dialog={deleteDialog} />
    </>
  );
}
