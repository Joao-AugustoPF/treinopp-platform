import type { IPolicy } from 'src/features/management/roles/types/role';

export const _policies: IPolicy[] = [
  {
    id: '1',
    name: 'Política do Dono da Academia',
    createdAt: new Date(),
    updatedAt: new Date(),
    permissions: [
      {
        id: '1',
        name: 'Gerenciar Academia',
        action: 'update',
        subject: 'Company',
      },
      {
        id: '2',
        name: 'Visualizar Academia',
        action: 'read',
        subject: 'Company',
      },
      {
        id: '3',
        name: 'Gerenciar Treinadores',
        action: 'update',
        subject: 'User',
      },
      {
        id: '4',
        name: 'Visualizar Treinadores',
        action: 'read',
        subject: 'User',
      },
      {
        id: '5',
        name: 'Gerenciar Alunos',
        action: 'update',
        subject: 'User',
      },
      {
        id: '6',
        name: 'Visualizar Alunos',
        action: 'read',
        subject: 'User',
      },
      {
        id: '7',
        name: 'Gerenciar Planos',
        action: 'update',
        subject: 'Product',
      },
      {
        id: '8',
        name: 'Visualizar Planos',
        action: 'read',
        subject: 'Product',
      },
      {
        id: '9',
        name: 'Gerenciar Vendas',
        action: 'update',
        subject: 'Order',
      },
      {
        id: '10',
        name: 'Visualizar Vendas',
        action: 'read',
        subject: 'Order',
      },
    ],
  },
  {
    id: '2',
    name: 'Política do Treinador',
    createdAt: new Date(),
    updatedAt: new Date(),
    permissions: [
      {
        id: '11',
        name: 'Visualizar Academia',
        action: 'read',
        subject: 'Company',
      },
      {
        id: '12',
        name: 'Visualizar Alunos',
        action: 'read',
        subject: 'User',
      },
      {
        id: '13',
        name: 'Gerenciar Treinos',
        action: 'update',
        subject: 'User',
      },
      {
        id: '14',
        name: 'Visualizar Planos',
        action: 'read',
        subject: 'Product',
      },
      {
        id: '15',
        name: 'Visualizar Vendas',
        action: 'read',
        subject: 'Order',
      },
    ],
  },
  {
    id: '3',
    name: 'Política do Suporte',
    createdAt: new Date(),
    updatedAt: new Date(),
    permissions: [
      {
        id: '16',
        name: 'Visualizar Academia',
        action: 'read',
        subject: 'Company',
      },
      {
        id: '17',
        name: 'Visualizar Alunos',
        action: 'read',
        subject: 'User',
      },
      {
        id: '18',
        name: 'Visualizar Treinadores',
        action: 'read',
        subject: 'User',
      },
      {
        id: '19',
        name: 'Visualizar Planos',
        action: 'read',
        subject: 'Product',
      },
      {
        id: '20',
        name: 'Visualizar Vendas',
        action: 'read',
        subject: 'Order',
      },
      {
        id: '21',
        name: 'Gerenciar Tickets',
        action: 'update',
        subject: 'Order',
      },
    ],
  },
];
