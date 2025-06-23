import type { IRole } from 'src/features/management/roles/types';

// Interface para usuários
export interface IUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  active: boolean;
  role: IRole | null;
  roleId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Dados mockados de usuários
export const _users: IUser[] = [
  {
    id: '1',
    name: 'Administrador',
    email: 'admin@example.com',
    avatar: '/assets/avatars/avatar_1.jpg',
    active: true,
    roleId: '1',
    role: null, // Será preenchido dinamicamente nas rotas
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Usuário Regular',
    email: 'user@example.com',
    avatar: '/assets/avatars/avatar_2.jpg',
    active: true,
    roleId: '2',
    role: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
