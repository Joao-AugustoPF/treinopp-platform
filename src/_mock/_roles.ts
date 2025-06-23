import type { IRole } from 'src/features/management/roles/types';

export const _roles: IRole[] = [
  {
    id: '1',
    name: 'Admin Role',
    createdAt: new Date(),
    updatedAt: new Date(),
    permissions: [
      {
        id: '1',
        name: 'Gerenciar Sistema',
        action: 'create',
        subject: 'User',
      },
    ],
    policies: [
      {
        id: '1',
        name: 'Política Admin',
        createdAt: new Date(),
        updatedAt: new Date(),
        permissions: [
          {
            id: '2',
            name: 'Gerenciar Tudo',
            action: 'create',
            subject: 'Company',
          },
        ],
      },
    ],
  },
];
