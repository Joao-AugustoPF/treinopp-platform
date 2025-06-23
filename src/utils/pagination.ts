import type { ApiResponse, PaginationParams } from 'src/types/api';

// ----------------------------------------------------------------------

export interface PaginationOptions extends PaginationParams {
  resourceName: string;
  searchField?: string;
}

export function paginateResponse<T>(data: T[], options: PaginationOptions): ApiResponse<T, string> {
  const { page = 1, limit = 10, search = '', resourceName, searchField = 'nome' } = options;

  // Filtrar dados se houver busca
  let filteredData = data;
  if (search && searchField) {
    filteredData = data.filter((item: any) => {
      const fieldValue = item[searchField];
      return fieldValue?.toString().toLowerCase().includes(search.toLowerCase());
    });
  }

  // Calcular total e índices para paginação
  const total = filteredData.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  // Paginar resultados
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Construir resposta
  return {
    [resourceName]: paginatedData,
    total,
    page,
    limit,
  } as ApiResponse<T, string>;
}

// ----------------------------------------------------------------------

export function extractPaginationParams(url: string): PaginationParams {
  const { searchParams } = new URL(url);

  return {
    page: Number(searchParams.get('page')) || 1,
    limit: Number(searchParams.get('limit')) || 10,
    search: searchParams.get('search') || '',
  };
}

// ----------------------------------------------------------------------

export function validatePaginationParams(params: PaginationParams): PaginationParams {
  const { page, limit = 10, search = '' } = params;

  return {
    page: Math.max(0, Number(page)),
    limit: Math.min(100, Math.max(1, Number(limit))), // Limita entre 1 e 100
    search: search?.toString() || '',
  };
}
