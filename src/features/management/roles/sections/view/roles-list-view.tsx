'use client';

import type { TableHeadCellProps } from 'src/components/table';

import { useState, useCallback } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';

import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { RoleForm } from '../role-form';
import { RoleTableRow } from '../role-table-row';
import { useListRoles, useDeleteRole } from '../../hooks';

import type { IRole } from '../../types';

// ----------------------------------------------------------------------

const TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'name', label: 'Nome', width: 200 },
  { id: 'policies', label: 'Políticas', width: 200 },
  { id: 'createdAt', label: 'Data de criação', width: 200 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function RolesListView() {
  const table = useTable();
  const confirmDialog = useBoolean();
  const createDialog = useBoolean();

  const [currentRole, setCurrentRole] = useState<IRole | null>(null);

  const { roles, isLoading, mutate } = useListRoles({
    page: table.page + 1,
    limit: table.rowsPerPage,
  });

  const { deleteRole } = useDeleteRole();

  const handleOpenEdit = useCallback(
    (role: IRole) => {
      setCurrentRole(role);
      createDialog.onTrue();
    },
    [createDialog]
  );

  const handleCloseEdit = useCallback(() => {
    setCurrentRole(null);
    createDialog.onFalse();
  }, [createDialog]);

  const handleDeleteRow = useCallback(
    async (id: string) => {
      try {
        await toast
          .promise(deleteRole(id), {
            loading: 'Excluindo perfil...',
            success: 'Perfil excluído com sucesso!',
            error: 'Erro ao excluir perfil',
          })
          .unwrap();
        await mutate();
        table.onUpdatePageDeleteRow(roles.length);
      } catch (error) {
        console.error(error);
        toast.error('Erro ao excluir perfil');
      }
    },
    [deleteRole, mutate, roles.length, table]
  );

  const handleDeleteRows = useCallback(async () => {
    try {
      // TODO: Implementar delete em massa
      await mutate();
      toast.success('Perfis excluídos com sucesso!');
      table.onUpdatePageDeleteRows(roles.length, roles.length);
      table.onSelectAllRows(false, []);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao excluir perfis');
    }
  }, [mutate, roles.length, table]);

  const notFound = !roles.length && !isLoading;

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Excluir"
      content={
        <>
          Tem certeza que deseja excluir <strong> {table.selected.length} </strong> perfis?
        </>
      }
      action={
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            handleDeleteRows();
            confirmDialog.onFalse();
          }}
        >
          Excluir
        </Button>
      }
    />
  );

  const renderCreateDialog = () => (
    <RoleForm
      open={createDialog.value}
      onClose={handleCloseEdit}
      currentRole={currentRole ?? undefined}
    />
  );

  const handleCreateRole = () => {
    setCurrentRole(null);
    createDialog.onTrue();
  };

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Perfis"
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={handleCreateRole}
            >
              Novo perfil
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={roles.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  roles.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Excluir">
                  <IconButton color="primary" onClick={confirmDialog.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headCells={TABLE_HEAD}
                  rowCount={roles.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      roles.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {roles.map((row) => (
                    <RoleTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onEditRow={() => handleOpenEdit(row)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                    />
                  ))}

                  <TableEmptyRows height={table.dense ? 56 : 76} emptyRows={0} />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>

          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            rowsPerPage={table.rowsPerPage}
            count={roles.length}
            onPageChange={table.onChangePage}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      </DashboardContent>

      {renderConfirmDialog()}
      {renderCreateDialog()}
    </>
  );
}
