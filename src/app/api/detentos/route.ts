import type { NextRequest } from 'next/server';
import type { IDetento } from 'src/features/detentos/detento/types';

import { headers } from 'next/headers';

import { verify } from 'src/utils/jwt';
import { STATUS, response } from 'src/utils/response';
import { validatePaginationParams } from 'src/utils/pagination';

import { JWT_SECRET } from 'src/_mock/_auth';
import { _detentos } from 'src/_mock/_detentos';

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
    const sexo = searchParams.get('Sexo');

    let filteredData = _detentos;

    if (search) {
      filteredData = filteredData.filter((detento) =>
        detento.Nome.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sexo) {
      filteredData = filteredData.filter((detento) => detento.Sexo === sexo);
    }

    const total = filteredData.length;
    const startIndex = page * limit;
    const endIndex = startIndex + limit;



    const paginatedData = filteredData.slice(startIndex, endIndex);
    

    return response(
      {
        detentos: paginatedData,
        total,
        page,
        limit,
      },
      STATUS.OK
    );
  } catch (error) {
    console.error('[Detentos API]: ', error);
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

    const newDetento: IDetento = {
      Id: `det_${Math.floor(Math.random() * 10000)}`,
      ...data,
      CreatedAt: new Date().toISOString(),
      CreatedBy: 'system',
      UpdatedAt: new Date().toISOString(),
      UpdatedBy: 'system',
      IsDeleted: false,
    };

    // Em um ambiente real, aqui você salvaria no banco de dados
    _detentos.push(newDetento);

    return response({ detento: newDetento }, STATUS.CREATED);
  } catch (error) {
    console.error('[Detentos - create]: ', error);
    return response('Internal server error', STATUS.ERROR);
  }
}
