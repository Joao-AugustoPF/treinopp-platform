import type {
  GridSortModel,
  GridFilterModel,
  GridPaginationModel,
  GridRowSelectionModel,
  GridColumnVisibilityModel,
} from '@mui/x-data-grid';

import { useMemo, useCallback } from 'react';
import { useSetState } from 'minimal-shared/hooks';

export type UseTableReturn<TFilters extends Record<string, any>> = {
  pagination: GridPaginationModel;
  sort: GridSortModel;
  visibleColumns: GridColumnVisibilityModel;
  selectedIds: GridRowSelectionModel;
  filters: GridFilterModel;
  filter: TFilters;
  onChangeSort: (_sort: GridSortModel) => void;
  onChangePagination: (_pagination: GridPaginationModel) => void;
  onChangeVisibleColumns: (_visibleColumns: GridColumnVisibilityModel) => void;
  onChangeSelectedIds: (_selectedIds: GridRowSelectionModel) => void;
  onChangeFilters: (_filters: GridFilterModel) => void;
  search: string;
};

export type UseTableProps = {
  visibleColumns?: GridColumnVisibilityModel;
  filters?: GridFilterModel;
};

const initialPagination: GridPaginationModel = { page: 0, pageSize: 10 };
const initialVisibleColumns: GridColumnVisibilityModel = {};
const initialSort: GridSortModel = [];
const initialSelectedIds: GridRowSelectionModel = [];
const initialFilters: GridFilterModel = { items: [] };

export const useTable = <TFilters extends Record<string, any>>(
  props?: UseTableProps
): UseTableReturn<TFilters> => {
  const { setField, state } = useSetState({
    pagination: initialPagination,
    sort: initialSort,
    visibleColumns: props?.visibleColumns ?? initialVisibleColumns,
    selectedIds: initialSelectedIds,
    filters: props?.filters ?? initialFilters,
  });

  const handleChangePagination = useCallback(
    (pagination: GridPaginationModel) => {
      setField('pagination', pagination);
    },
    [setField]
  );

  const handleChangeSort = useCallback(
    (sort: GridSortModel) => {
      setField('sort', sort);
    },
    [setField]
  );

  const handleChangeVisibleColumns = useCallback(
    (visibleColumns: GridColumnVisibilityModel) => {
      setField('visibleColumns', visibleColumns);
    },
    [setField]
  );

  const handleChangeSelectedIds = useCallback(
    (selectedIds: GridRowSelectionModel) => {
      setField('selectedIds', selectedIds);
    },
    [setField]
  );

  const handleChangeFilters = useCallback(
    (filters: GridFilterModel) => {
      setField('filters', filters);
    },
    [setField]
  );

  const search = useMemo(() => {
    if (!state.filters.quickFilterValues) return '';
    return state.filters.quickFilterValues.join(' ');
  }, [state.filters.quickFilterValues]);

  const filter = useMemo(
    () =>
      state.filters.items.reduce((acc, item) => {
        acc[item.field as keyof TFilters] = item.value;
        return acc;
      }, {} as TFilters),
    [state.filters.items]
  );

  return {
    pagination: state.pagination,
    sort: state.sort,
    visibleColumns: state.visibleColumns,
    selectedIds: state.selectedIds,
    filters: state.filters,
    filter,
    onChangePagination: handleChangePagination,
    onChangeSort: handleChangeSort,
    onChangeVisibleColumns: handleChangeVisibleColumns,
    onChangeSelectedIds: handleChangeSelectedIds,
    onChangeFilters: handleChangeFilters,
    search,
  };
};
