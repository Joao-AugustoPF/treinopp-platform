export type ApiResponse<TEntity, TField extends string> = {
  [key in TField]: TEntity[];
} & {
  total: number;
  page: number;
  limit: number;
};

export type PaginationParams = {
  page?: number;
  limit?: number;
  search?: string;
};
