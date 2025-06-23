import { headers } from 'next/headers';

import { verify } from 'src/utils/jwt';
import { STATUS, response } from 'src/utils/response';

import { JWT_SECRET } from 'src/_mock/_auth';
import { _unidades } from 'src/_mock/_unidades';

// ----------------------------------------------------------------------

export const runtime = 'edge';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const headersList = headers();
    const authorization = headersList.get('authorization');

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return response('Authorization token missing or invalid', STATUS.UNAUTHORIZED);
    }

    const accessToken = `${authorization}`.split(' ')[1];
    await verify(accessToken, JWT_SECRET);

    const unidade = _unidades.find((u) => u.Id === params.id);

    if (!unidade) {
      return response('Unidade não encontrada', STATUS.NOT_FOUND);
    }

    return response({ unidade }, STATUS.OK);
  } catch (error) {
    console.error('[Unidades - get]: ', error);
    return response('Internal server error', STATUS.ERROR);
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const headersList = headers();
    const authorization = headersList.get('authorization');

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return response('Authorization token missing or invalid', STATUS.UNAUTHORIZED);
    }

    const accessToken = `${authorization}`.split(' ')[1];
    await verify(accessToken, JWT_SECRET);

    const data = await request.json();
    const unidadeIndex = _unidades.findIndex((u) => u.Id === params.id);

    if (unidadeIndex === -1) {
      return response('Unidade não encontrada', STATUS.NOT_FOUND);
    }

    const updatedUnidade = {
      ..._unidades[unidadeIndex],
      ...data,
      UpdatedAt: new Date().toISOString(),
    };

    _unidades[unidadeIndex] = updatedUnidade;

    return response({ unidade: updatedUnidade }, STATUS.OK);
  } catch (error) {
    console.error('[Unidades - update]: ', error);
    return response('Internal server error', STATUS.ERROR);
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const headersList = headers();
    const authorization = headersList.get('authorization');

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return response('Authorization token missing or invalid', STATUS.UNAUTHORIZED);
    }

    const accessToken = `${authorization}`.split(' ')[1];
    await verify(accessToken, JWT_SECRET);

    const unidadeIndex = _unidades.findIndex((u) => u.Id === params.id);

    if (unidadeIndex === -1) {
      return response('Unidade não encontrada', STATUS.NOT_FOUND);
    }

    _unidades.splice(unidadeIndex, 1);

    return response({ message: 'Unidade excluída com sucesso' }, STATUS.OK);
  } catch (error) {
    console.error('[Unidades - delete]: ', error);
    return response('Internal server error', STATUS.ERROR);
  }
}
