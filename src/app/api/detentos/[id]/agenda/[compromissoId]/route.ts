import { headers } from 'next/headers';

import { verify } from 'src/utils/jwt';
import { STATUS, response } from 'src/utils/response';

import { JWT_SECRET } from 'src/_mock/_auth';
import { _detentos } from 'src/_mock/_detentos';

// Mock de compromissos/agendas para cada detento - importa do arquivo principal
import { _compromissos } from '../_compromissos';

// ----------------------------------------------------------------------

export const runtime = 'edge';

export async function PUT(
  request: Request,
  { params }: { params: { id: string; compromissoId: string } }
) {
  try {
    const detentoId = params.id;
    const compromissoId = params.compromissoId;

    const headersList = headers();
    const authorization = headersList.get('authorization');

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return response('Authorization token missing or invalid', STATUS.UNAUTHORIZED);
    }

    const accessToken = `${authorization}`.split(' ')[1];
    await verify(accessToken, JWT_SECRET);

    // Verifica se o detento existe
    const detento = _detentos.find((d) => d.Id === detentoId);
    if (!detento) {
      return response('Detento não encontrado', STATUS.NOT_FOUND);
    }

    // Verifica se há compromissos para este detento
    if (!_compromissos[detentoId]) {
      return response('Nenhum compromisso encontrado para este detento', STATUS.NOT_FOUND);
    }

    // Busca o compromisso específico
    const compromissoIndex = _compromissos[detentoId].findIndex((c) => c.Id === compromissoId);
    if (compromissoIndex === -1) {
      return response('Compromisso não encontrado', STATUS.NOT_FOUND);
    }

    const data = await request.json();

    // Atualiza apenas os campos fornecidos
    const compromissoAtualizado = {
      ..._compromissos[detentoId][compromissoIndex],
      ...data,
      UpdatedAt: new Date().toISOString(),
      UpdatedBy: 'system',
      // Garante que o ID e o detentoId não sejam alterados
      Id: compromissoId,
      DetentoId: detentoId,
    };

    // Atualiza o compromisso no array
    _compromissos[detentoId][compromissoIndex] = compromissoAtualizado;

    return response({ compromisso: compromissoAtualizado }, STATUS.OK);
  } catch (error) {
    console.error('[Agenda API - update specific]: ', error);
    return response('Internal server error', STATUS.ERROR);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; compromissoId: string } }
) {
  try {
    const detentoId = params.id;
    const compromissoId = params.compromissoId;

    const headersList = headers();
    const authorization = headersList.get('authorization');

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return response('Authorization token missing or invalid', STATUS.UNAUTHORIZED);
    }

    const accessToken = `${authorization}`.split(' ')[1];
    await verify(accessToken, JWT_SECRET);

    // Verifica se o detento existe
    const detento = _detentos.find((d) => d.Id === detentoId);
    if (!detento) {
      return response('Detento não encontrado', STATUS.NOT_FOUND);
    }

    // Verifica se há compromissos para este detento
    if (!_compromissos[detentoId]) {
      return response('Nenhum compromisso encontrado para este detento', STATUS.NOT_FOUND);
    }

    // Busca o compromisso específico
    const compromissoIndex = _compromissos[detentoId].findIndex((c) => c.Id === compromissoId);
    if (compromissoIndex === -1) {
      return response('Compromisso não encontrado', STATUS.NOT_FOUND);
    }

    // Marca como excluído (soft delete) ou remove completamente
    // Aqui estou usando soft delete
    _compromissos[detentoId][compromissoIndex] = {
      ..._compromissos[detentoId][compromissoIndex],
      IsDeleted: true,
      UpdatedAt: new Date().toISOString(),
      UpdatedBy: 'system',
    };

    return response({ message: 'Compromisso excluído com sucesso' }, STATUS.OK);
  } catch (error) {
    console.error('[Agenda API - delete specific]: ', error);
    return response('Internal server error', STATUS.ERROR);
  }
}
