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
import { useAcademiaListViewStore } from 'src/features/academias/academia/stores/academia-list-view.store';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { DataGrid } from 'src/components/data-grid/data-grid';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { useAuthContext } from 'src/auth/hooks';

import { AlunoForm } from '../aluno-form';
import { AlunoCard } from '../aluno-card';
import { useListAlunos, useAlunoFilters } from '../../hooks';
import { getAlunoTableColumns } from '../table-columns';
import { DeleteAlunoDialog } from '../delete-aluno-dialog';
import { MensalidadeControl } from '../mensalidade-control';
import { useListMensalidades } from '../../hooks/use-mensalidades';
import { useAlunoListViewStore } from '../../stores/aluno-list-view.store';
import {
  AlunoFiltersDrawer,
  AlunoFiltersResult,
  AlunoTableToolbar,
  AlunoTableFiltersResult,
  AlunoSearch,
  AlunoSort,
} from '../index';

import type { IAluno, IAlunoTableFilters } from '../../types/aluno';
import { Status } from '../../types/aluno';

export function AlunoListView() {
  const theme = useTheme();
  const { setCurrentAluno, setAlunoToDelete, currentAluno } = useAlunoListViewStore();
  const { selectedAcademia } = useAcademiaListViewStore();
  const { user } = useAuthContext();

  const isSupport = () => user?.profile?.role === 'SUPPORT';

  const createDialog = useBoolean();
  const deleteDialog = useBoolean();
  const mensalidadeDialog = useBoolean();
  const filtersDrawer = useBoolean();

  const table = useTable<IAlunoTableFilters>();
  const filters = useAlunoFilters();

  const debouncedSearch = useDebounce(table.search, 500);

  const { alunos, isLoading, isValidating, total } = useListAlunos({
    page: table.pagination.page || 0,
    limit: table.pagination.pageSize || 10,
    search: debouncedSearch || '',
    status: filters.state.status || '',
    tenantId: isSupport() ? selectedAcademia?.Id || '' : '',
  });

  // Hook para mensalidades do aluno selecionado
  const { mensalidades, mutate: refreshMensalidades } = useListMensalidades(currentAluno?.Id || '');

  // Calcular estatísticas baseadas nos dados reais
  const stats = useMemo(() => {
    const ativos = alunos.filter((aluno: IAluno) => aluno.Status === Status.ACTIVE).length;
    const inativos = alunos.filter((aluno: IAluno) => aluno.Status === Status.INACTIVE).length;
    const pendentes = alunos.filter((aluno: IAluno) => aluno.Status === Status.PENDING).length;
    const bloqueados = alunos.filter((aluno: IAluno) => aluno.Status === Status.BLOCKED).length;

    return {
      total: alunos.length,
      ativos,
      inativos,
      pendentes,
      bloqueados,
    };
  }, [alunos]);

  const handleOpenCreate = useCallback(() => {
    setCurrentAluno(null);
    createDialog.onTrue();
  }, [createDialog, setCurrentAluno]);

  const handleOpenEdit = useCallback(
    (aluno: IAluno) => {
      setCurrentAluno(aluno);
      createDialog.onTrue();
    },
    [createDialog, setCurrentAluno]
  );

  const handleOpenDelete = useCallback(
    (aluno: IAluno) => {
      setAlunoToDelete(aluno);
      deleteDialog.onTrue();
    },
    [deleteDialog, setAlunoToDelete]
  );

  const handleOpenMensalidades = useCallback(
    (aluno: IAluno) => {
      setCurrentAluno(aluno);
      mensalidadeDialog.onTrue();
    },
    [mensalidadeDialog, setCurrentAluno]
  );

  const columns = useMemo(
    () =>
      getAlunoTableColumns({
        handleOpenEdit,
        handleOpenDelete,
        handleOpenMensalidades,
      }),
    [handleOpenDelete, handleOpenEdit, handleOpenMensalidades]
  );

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
      { value: 'Plano.Nome', label: 'Plano' },
      { value: 'CreatedAt', label: 'Data de Cadastro' },
    ],
    []
  );

  if (isSupport() && !selectedAcademia) {
    return (
      <DashboardContent>
        <CustomBreadcrumbs heading="Selecione uma Academia" links={[{ name: 'Alunos' }]} />
        <Card sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Typography variant="h6">
              Para visualizar os alunos, selecione uma academia primeiro.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
              href={paths.academia.list}
            >
              Ir para Lista de Academias
            </Button>
          </Stack>
        </Card>
      </DashboardContent>
    );
  }

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Ficha cadastral"
          links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Alunos' }]}
          action={
            <Button
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={handleOpenCreate}
            >
              Novo Aluno
            </Button>
          }
        />

        <Card sx={{ mb: { xs: 3, md: 5 } }}>
          <Scrollbar>
            <Stack
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{ py: 2, flexDirection: 'row' }}
            >
              <AlunoCard
                percent={100}
                title="Total"
                total={total}
                value={stats.total}
                icon="solar:user-bold-duotone"
                color={theme.vars.palette.primary.main}
              />
              <AlunoCard
                percent={stats.total > 0 ? Math.round((stats.ativos / stats.total) * 100) : 0}
                title="Ativos"
                total={stats.total}
                value={stats.ativos}
                icon="solar:check-circle-bold-duotone"
                color={theme.vars.palette.success.main}
              />
              <AlunoCard
                percent={stats.total > 0 ? Math.round((stats.inativos / stats.total) * 100) : 0}
                title="Inativos"
                total={stats.total}
                value={stats.inativos}
                icon="solar:close-circle-bold-duotone"
                color={theme.vars.palette.error.main}
              />
              <AlunoCard
                percent={stats.total > 0 ? Math.round((stats.pendentes / stats.total) * 100) : 0}
                title="Pendentes"
                total={stats.total}
                value={stats.pendentes}
                icon="solar:clock-circle-bold-duotone"
                color={theme.vars.palette.warning.main}
              />
              <AlunoCard
                percent={stats.total > 0 ? Math.round((stats.bloqueados / stats.total) * 100) : 0}
                title="Bloqueados"
                total={stats.total}
                value={stats.bloqueados}
                icon="solar:forbidden-bold-duotone"
                color={theme.vars.palette.grey[600]}
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
            <AlunoSearch
              redirectPath={paths.aluno.details}
              options={alunos}
              loading={isLoading}
              sx={{ flexGrow: 1 }}
            />

            <AlunoSort
              sort={table.sort[0]?.field || 'Nome'}
              onSort={(value) => table.onChangeSort([{ field: value, sort: 'asc' }])}
              sortOptions={sortOptions}
            />

            <AlunoFiltersDrawer
              open={filtersDrawer.value}
              onOpen={filtersDrawer.onTrue}
              onClose={filtersDrawer.onFalse}
              canReset={filters.hasActiveFilters()}
              filters={filters}
              options={filterOptions}
            />
          </Stack>

          <AlunoFiltersResult filters={filters} totalResults={total} sx={{ px: 2.5, pb: 2.5 }} />
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
            rows={alunos}
            columns={columns}
            loading={isLoading || isValidating}
            rowCount={total}
            toolbar={(props) => (
              <AlunoTableToolbar {...props} filters={filters} options={filterOptions} />
            )}
          />
        </Card>
      </DashboardContent>

      <AlunoForm
        open={createDialog.value}
        onClose={createDialog.onFalse}
        currentAluno={currentAluno}
      />

      <DeleteAlunoDialog dialog={deleteDialog} />

      {/* Dialog para gerenciar mensalidades */}
      {currentAluno && (
        <MensalidadeDialog
          open={mensalidadeDialog.value}
          onClose={mensalidadeDialog.onFalse}
          aluno={currentAluno}
          mensalidades={mensalidades}
          onRefresh={refreshMensalidades}
        />
      )}
    </>
  );
}

// Dialog específico para mensalidades na lista
interface MensalidadeDialogProps {
  open: boolean;
  onClose: VoidFunction;
  aluno: IAluno;
  mensalidades: any[];
  onRefresh: VoidFunction;
}

function MensalidadeDialog({
  open,
  onClose,
  aluno,
  mensalidades,
  onRefresh,
}: MensalidadeDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { height: '80vh' },
      }}
    >
      <DialogTitle>
        Mensalidades - {aluno.Nome}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <MensalidadeControl aluno={aluno} mensalidades={mensalidades} onRefresh={onRefresh} />
      </DialogContent>
    </Dialog>
  );
}
