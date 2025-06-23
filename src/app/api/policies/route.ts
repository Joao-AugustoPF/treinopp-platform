import type { NextRequest } from 'next/server';

import { STATUS, response } from 'src/utils/response';

import { _policies } from 'src/_mock/_policies';
import { actions, subjects } from 'src/features/management/roles/types/role';

export async function GET() {
  try {
    return response({ policies: _policies }, STATUS.OK);
  } catch (error) {
    console.error('[Policies - list]: ', error);
    return response({ message: 'Erro interno do servidor' }, STATUS.ERROR);
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (!data.name) {
      return response({ message: 'Nome da política é obrigatório' }, STATUS.BAD_REQUEST);
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

    const newPolicy = {
      id: String(_policies.length + 1),
      name: data.name,
      permissions: data.permissions || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    _policies.push(newPolicy);

    return response(
      {
        message: 'Política criada com sucesso',
        policy: newPolicy,
      },
      STATUS.CREATED
    );
  } catch (error) {
    console.error('[Policies - create]: ', error);
    return response({ message: 'Erro interno do servidor' }, STATUS.ERROR);
  }
}
