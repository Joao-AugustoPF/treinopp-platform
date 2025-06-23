'use client';

import { useState } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import { Button, Container } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';
// import { TableNoData } from 'src/components/table-no-data';
// import { TableEmptyRows } from 'src/components/table-empty-rows';
// import { TableHeadCustom } from 'src/components/table-head-custom';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
// import { TablePaginationCustom } from 'src/components/table-pagination-custom';

import { useListTreinos } from '../../hooks/use-treino';

const TABLE_HEAD = [
  { id: 'nome', label: 'Nome' },
  { id: 'tipoTreino', label: 'Tipo' },
  { id: 'aluno', label: 'Aluno' },
  { id: 'exercicios', label: 'Exercícios' },
  { id: 'actions', label: 'Ações', width: 88 },
];

const defaultFilters = {
  name: '',
};

export function TreinoListView() {
  const router = useRouter();
  const openForm = useBoolean();

  const [filters, setFilters] = useState(defaultFilters);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentTreino, setCurrentTreino] = useState(null);

  const { treinos, isLoading, mutate } = useListTreinos({
    page: page + 1,
    limit: rowsPerPage,
    search: filters.name,
  });

  const handleFilters = (name: string, value: string) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEdit = (treino: any) => {
    setCurrentTreino(treino);
    openForm.onTrue();
  };

  const handleView = (id: string) => {
    router.push(paths.treino.details(id));
  };

  const handleDelete = async (id: string) => {
    try {
      // await deleteTreino(id);
      mutate();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseForm = () => {
    openForm.onFalse();
    setCurrentTreino(null);
  };

  const handleSuccess = () => {
    mutate();
    handleCloseForm();
  };

  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading="Treinos"
        links={[{ name: 'Treinos' }]}
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={openForm.onTrue}
          >
            Novo Treino
          </Button>
        }
      />

      {/* <Card>
        <TableToolbar filters={filters} onFilters={handleFilters} />

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size="small" sx={{ minWidth: 800 }}>
              <TableHeadCustom headLabel={TABLE_HEAD} />

              <TableBody>
                {treinos.map((treino) => (
                  <TreinoTableRow
                    key={treino.Id}
                    row={treino}
                    onView={() => handleView(treino.Id)}
                    onEdit={() => handleEdit(treino)}
                    onDelete={() => handleDelete(treino.Id)}
                  />
                ))}

                <TableEmptyRows height={52} emptyRows={Math.max(0, rowsPerPage - treinos.length)} />

                <TableNoData notFound={!isLoading && !treinos.length} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={treinos.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => setRowsPerPage(Number(e.target.value))}
        />
      </Card>

      <TreinoForm
        open={openForm.value}
        onClose={handleCloseForm}
        onSuccess={handleSuccess}
        defaultValues={currentTreino}
        isEditing={!!currentTreino}
      /> */}
    </Container>
  );
}
