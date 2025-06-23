import type { NextRequest } from 'next/server';
import type { IUnidade } from 'src/features/unidades/unidade/types';

import { headers } from 'next/headers';

import { verify } from 'src/utils/jwt';
import { STATUS, response } from 'src/utils/response';
import { validatePaginationParams } from 'src/utils/pagination';

import { JWT_SECRET } from 'src/_mock/_auth';
import { _unidades } from 'src/_mock/_unidades';

// ----------------------------------------------------------------------

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const searchParams = new URL(req.url).searchParams;

    const validatedParams = validatePaginationParams({
      page: Number(searchParams.get('page')) || 0,
      limit: Number(searchParams.get('limit')) || 10,
      search: searchParams.get('search') || '',
    });

    const { page = 0, limit = 10, search = '' } = validatedParams;
    const estado = searchParams.get('Estado');
    const cidade = searchParams.get('Cidade');

    let filteredData = _unidades;

    if (search) {
      filteredData = filteredData.filter((unidade) =>
        unidade.Nome.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (estado) {
      filteredData = filteredData.filter((unidade) => unidade.Estado === estado);
    }

    if (cidade) {
      filteredData = filteredData.filter((unidade) => unidade.Cidade === cidade);
    }

    const total = filteredData.length;
    const startIndex = page * limit;
    const endIndex = startIndex + limit;

    const paginatedData = filteredData.slice(startIndex, endIndex);

    return response(
      {
        unidades: paginatedData,
        total,
        page,
        limit,
      },
      STATUS.OK
    );
  } catch (error) {
    console.error('[Unidades API]: ', error);
    return response({ message: 'Internal server error' }, STATUS.ERROR);
  }
}

export async function POST(request: Request) {
  try {
    const headersList = headers();
    const authorization = headersList.get('authorization');

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return response('Authorization token missing or invalid', STATUS.UNAUTHORIZED);
    }

    const accessToken = `${authorization}`.split(' ')[1];
    await verify(accessToken, JWT_SECRET);

    const data = await request.json();

    const newUnidade: IUnidade = {
      Id: `uni_${Math.floor(Math.random() * 10000)}`,
      ...data,
      CreatedAt: new Date().toISOString(),
      CreatedBy: 'system',
      UpdatedAt: new Date().toISOString(),
      UpdatedBy: 'system',
      IsDeleted: false,
    };

    _unidades.push(newUnidade);

    return response({ unidade: newUnidade }, STATUS.CREATED);
  } catch (error) {
    console.error('[Unidades - create]: ', error);
    return response('Internal server error', STATUS.ERROR);
  }
}
