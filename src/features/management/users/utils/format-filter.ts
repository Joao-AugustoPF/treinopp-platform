import type { IUserTableFilters } from 'src/types/user';

import type { IUser } from '../types/user';

export function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: IUser[];
  filters: IUserTableFilters;
  comparator: (a: any, b: any) => number;
}) {
  const { name, status, role } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter((user) => user.name.toLowerCase().includes(name.toLowerCase()));
  }

  if (status !== 'all') {
    inputData = inputData.filter((user) => user.status === status);
  }

  if (role.length) {
    inputData = inputData.filter((user) => {
      if (!user.role) return false;

      if (typeof user.role === 'object') {
        return role.includes(user.role.id);
      }

      return user.roleId ? role.includes(user.roleId) : false;
    });
  }

  return inputData;
}
