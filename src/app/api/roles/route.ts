import type { NextRequest } from 'next/server';

import { STATUS, response } from 'src/utils/response';

import { _roles } from 'src/_mock/_roles';
import { actions, subjects } from 'src/features/management/roles/types';

export async function GET() {
  try {
    return response({ roles: _roles }, STATUS.OK);
  } catch (error) {
    console.error('[Roles - list]: ', error);
    return response({ message: 'Erro interno do servidor' }, STATUS.ERROR);
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (!data.name) {
      return response({ message: 'Nome do role é obrigatório' }, STATUS.BAD_REQUEST);
    }

    // Valida permissions
    if (data.permissions) {
      const validPermissions = data.permissions.every(
        (perm: any) => perm.name && actions.includes(perm.action) && subjects.includes(perm.subject)
      );

      if (!validPermissions) {
        return response({ message: 'Permissões inválidas' }, STATUS.BAD_REQUEST);
      }
    }

    // Valida policies
    if (data.policies) {
      const validPolicies = data.policies.every(
        (policy: any) =>
          policy.id &&
          policy.name &&
          Array.isArray(policy.permissions) &&
          policy.permissions.every(
            (perm: any) =>
              perm.id &&
              perm.name &&
              actions.includes(perm.action) &&
              subjects.includes(perm.subject)
          )
      );

      if (!validPolicies) {
        return response({ message: 'Políticas inválidas' }, STATUS.BAD_REQUEST);
      }
    }

    const newRole = {
      id: String(_roles.length + 1),
      name: data.name,
      permissions: data.permissions || [],
      policies: data.policies || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    _roles.push(newRole);

    return response(
      {
        message: 'Role criado com sucesso',
        role: newRole,
      },
      STATUS.CREATED
    );
  } catch (error) {
    console.error('[Roles - create]: ', error);
    return response({ message: 'Erro interno do servidor' }, STATUS.ERROR);
  }
}
