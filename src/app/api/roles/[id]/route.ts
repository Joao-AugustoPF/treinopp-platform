import type { NextRequest } from 'next/server';

import { STATUS, response } from 'src/utils/response';

import { _roles } from 'src/_mock/_roles';
import { actions, subjects } from 'src/features/management/roles/types';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const role = _roles.find((r) => r.id === params.id);

    if (!role) {
      return response({ message: 'Role não encontrado' }, STATUS.NOT_FOUND);
    }

    return response({ role }, STATUS.OK);
  } catch (error) {
    console.error('[Roles - get]: ', error);
    return response({ message: 'Erro interno do servidor' }, STATUS.ERROR);
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();
    const index = _roles.findIndex((r) => r.id === params.id);

    if (index === -1) {
      return response({ message: 'Role não encontrado' }, STATUS.NOT_FOUND);
    }

    // Validações
    if (data.permissions) {
      const validPermissions = data.permissions.every(
        (perm: any) => perm.name && actions.includes(perm.action) && subjects.includes(perm.subject)
      );

      if (!validPermissions) {
        return response({ message: 'Permissões inválidas' }, STATUS.BAD_REQUEST);
      }
    }

    if (data.policies) {
      const validPolicies = data.policies.every(
        (policy: any) => policy.id && policy.name && Array.isArray(policy.permissions)
      );

      if (!validPolicies) {
        return response({ message: 'Políticas inválidas' }, STATUS.BAD_REQUEST);
      }
    }

    _roles[index] = {
      ..._roles[index],
      ...data,
      updatedAt: new Date(),
    };

    return response(
      {
        message: 'Role atualizado com sucesso',
        role: _roles[index],
      },
      STATUS.OK
    );
  } catch (error) {
    console.error('[Roles - update]: ', error);
    return response({ message: 'Erro interno do servidor' }, STATUS.ERROR);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const index = _roles.findIndex((r) => r.id === params.id);

    if (index === -1) {
      return response({ message: 'Role não encontrado' }, STATUS.NOT_FOUND);
    }

    _roles.splice(index, 1);

    return response({ message: 'Role removido com sucesso' }, STATUS.OK);
  } catch (error) {
    console.error('[Roles - delete]: ', error);
    return response({ message: 'Erro interno do servidor' }, STATUS.ERROR);
  }
}
