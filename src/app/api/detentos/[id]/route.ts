import { headers } from 'next/headers';

import { verify } from 'src/utils/jwt';
import { STATUS, response } from 'src/utils/response';

import { JWT_SECRET } from 'src/_mock/_auth';
import { _detentos } from 'src/_mock/_detentos';

// ----------------------------------------------------------------------

export const runtime = 'edge';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // const headersList = headers();
    // const authorization = headersList.get('authorization');

    // if (!authorization || !authorization.startsWith('Bearer ')) {
    //   return response('Authorization token missing or invalid', STATUS.UNAUTHORIZED);
    // }

    // const accessToken = `${authorization}`.split(' ')[1];
    // await verify(accessToken, JWT_SECRET);

    const detento = _detentos.find((d) => d.Id === params.id);

    if (!detento) {
      return response('Detento não encontrado', STATUS.NOT_FOUND);
    }

    return response({ detento }, STATUS.OK);
  } catch (error) {
    console.error('[Detentos - get]: ', error);
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
    const detentoIndex = _detentos.findIndex((d) => d.Id === params.id);

    if (detentoIndex === -1) {
      return response('Detento não encontrado', STATUS.NOT_FOUND);
    }

    const updatedDetento = {
      ..._detentos[detentoIndex],
      ...data,
      UpdatedAt: new Date().toISOString(),
    };

    _detentos[detentoIndex] = updatedDetento;

    return response({ detento: updatedDetento }, STATUS.OK);
  } catch (error) {
    console.error('[Detentos - update]: ', error);
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

    const detentoIndex = _detentos.findIndex((d) => d.Id === params.id);

    if (detentoIndex === -1) {
      return response('Detento não encontrado', STATUS.NOT_FOUND);
    }

    _detentos.splice(detentoIndex, 1);

    return response({ message: 'Detento excluído com sucesso' }, STATUS.OK);
  } catch (error) {
    console.error('[Detentos - delete]: ', error);
    return response('Internal server error', STATUS.ERROR);
  }
}
