import type { UseTableReturn } from 'src/hooks/use-table';
import type {
  GridSlotProps,
  GridValidRowModel,
  DataGridProps as MuiDataGridProps,
} from '@mui/x-data-grid';

import { gridClasses, GridToolbar, DataGrid as MuiDataGrid } from '@mui/x-data-grid';

import { EmptyContent } from '../empty-content';

export type DataGridProps<
  R extends GridValidRowModel,
  TFilters extends Record<string, any>,
> = UseTableReturn<TFilters> &
  Omit<MuiDataGridProps<R>, 'pagination'> & {
    toolbar?: React.JSXElementConstructor<GridSlotProps['toolbar']> | null;
  };

export const DataGrid = <R extends GridValidRowModel, TFilters extends Record<string, any>>(
  props: DataGridProps<R, TFilters>
) => (
  <MuiDataGrid
    {...props}
    pagination
    paginationModel={props.pagination}
    sortModel={props.sort}
    columnVisibilityModel={props.visibleColumns}
    rowSelectionModel={props.selectedIds}
    filterModel={props.filters}
    onPaginationModelChange={props.onChangePagination}
    onSortModelChange={props.onChangeSort}
    onRowSelectionModelChange={props.onChangeSelectedIds}
    onColumnVisibilityModelChange={props.onChangeVisibleColumns}
    onFilterModelChange={props.onChangeFilters}
    paginationMode="server"
    sortingMode="server"
    filterMode="server"
    checkboxSelection
    disableRowSelectionOnClick
    getRowId={(row) => row.Id}
    getRowHeight={(params) => (params.densityFactor ?? 1) * 64}
    pageSizeOptions={[5, 10, 20]}
    slots={{
      toolbar: props.toolbar ?? GridToolbar,
      noRowsOverlay: () => <EmptyContent />,
      noResultsOverlay: () => <EmptyContent title="Nenhum resultado encontrado" />,
    }}
    sx={{ [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' } }}
    slotProps={{ toolbar: { showQuickFilter: true } }}
  />
);
