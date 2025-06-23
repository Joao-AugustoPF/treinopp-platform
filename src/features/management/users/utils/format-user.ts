import type { IUser } from '../types/user';

/**
 * Formata um usuário da API para exibição na UI
 */
export const formatUserForDisplay = (user: IUser): IUser => {
  // Cria um novo objeto para evitar mutações no objeto original
  const formattedUser: IUser = {
    ...user,
    status: user.active ? 'active' : 'banned',
  };

  // Tratando a propriedade role para exibição
  if (typeof formattedUser.role === 'object' && formattedUser.role !== null) {
    // Armazena o nome do role para exibição
    const roleName = formattedUser.role.name;
    (formattedUser as any).role = roleName;
  }

  return formattedUser;
};

/**
 * Formata uma lista de usuários da API para exibição na UI
 */
export const formatUsersForDisplay = (users: IUser[]): IUser[] => users.map(formatUserForDisplay);

export const getRoleName = (role: IUser['role']): string => {
  if (!role) return '';

  if (typeof role === 'object') {
    return role.name;
  }

  return role;
};

export const getStatusLabel = (status: string | undefined): string => {
  if (status === 'active') return 'Ativo';
  if (status === 'pending') return 'Pendente';
  if (status === 'banned') return 'Bloqueado';
  return status || '';
};

export const adaptUserToFormValues = (user?: IUser): any => {
  if (!user) return undefined;

  return {
    name: user.name || '',
    email: user.email || '',
    phoneNumber: user.phoneNumber || '',
    country: user.country || '',
    state: user.state || '',
    city: user.city || '',
    address: user.address || '',
    zipCode: user.zipCode || '',
    company: user.company || '',
    role: typeof user.role === 'object' ? user.role?.id || '' : user.roleId || '',
    status: user.status || '',
    isVerified: user.isVerified || false,
    avatarUrl: user.avatarUrl || null,
  };
};
