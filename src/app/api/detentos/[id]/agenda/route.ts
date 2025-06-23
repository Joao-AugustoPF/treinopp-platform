import type { NextRequest } from 'next/server';

import { v4 as uuidv4 } from 'uuid';
import { headers } from 'next/headers';

import { verify } from 'src/utils/jwt';
import { STATUS, response } from 'src/utils/response';

import { JWT_SECRET } from 'src/_mock/_auth';
import { _detentos } from 'src/_mock/_detentos';
import { TipoAtendimento } from 'src/features/detentos/detento/types/compromisso';

// Importa o mock de compromissos compartilhado
import { _compromissos } from './_compromissos';
// ----------------------------------------------------------------------

export const runtime = 'edge';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const headersList = headers();
    const authorization = headersList.get('authorization');

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return response('Authorization token missing or invalid', STATUS.UNAUTHORIZED);
    }

    const accessToken = `${authorization}`.split(' ')[1];
    await verify(accessToken, JWT_SECRET);

    const detentoId = params.id;

    // Verifica se o detento existe
    const detento = _detentos.find((d) => d.Id === detentoId);
    if (!detento) {
      return response('Detento não encontrado', STATUS.NOT_FOUND);
    }

    // Parâmetros de filtro de data
    const searchParams = new URL(request.url).searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let compromissosDetento = _compromissos[detentoId] || [];

    // Filtra por intervalo de datas se especificado
    if (startDate || endDate) {
      compromissosDetento = compromissosDetento.filter((compromisso) => {
        const dataCompromisso = compromisso.DataAgendamentoCompromisso;

        if (startDate && endDate) {
          return dataCompromisso >= startDate && dataCompromisso <= endDate;
        }

        if (startDate) {
          return dataCompromisso >= startDate;
        }

        if (endDate) {
          return dataCompromisso <= endDate;
        }

        return true;
      });
    }

    // Filtra apenas compromissos não deletados
    compromissosDetento = compromissosDetento.filter((comp) => !comp.IsDeleted);

    return response(
      {
        agenda: compromissosDetento,
        total: compromissosDetento.length,
      },
      STATUS.OK
    );
  } catch (error) {
    console.error('[Agenda API]: ', error);
    return response({ message: 'Internal server error' }, STATUS.ERROR);
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const headersList = headers();
    const authorization = headersList.get('authorization');

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return response('Authorization token missing or invalid', STATUS.UNAUTHORIZED);
    }

    const accessToken = `${authorization}`.split(' ')[1];
    await verify(accessToken, JWT_SECRET);

    const detentoId = params.id;

    // Verifica se o detento existe
    const detento = _detentos.find((d) => d.Id === detentoId);
    if (!detento) {
      return response('Detento não encontrado', STATUS.NOT_FOUND);
    }

    const data = await request.json();

    // Valida dados mínimos necessários
    if (
      !data.Nome ||
      !data.DataAgendamentoCompromisso ||
      !data.HoraAgendamentoCompromisso ||
      !data.LocalCompromisso ||
      !data.TipoAtendimento
    ) {
      return response('Dados incompletos para criar o compromisso', STATUS.BAD_REQUEST);
    }

    // Certifica-se que o DetentoId é o mesmo da URL
    data.DetentoId = detentoId;

    const novoCompromisso = {
      Id: uuidv4(),
      ...data,
      CreatedAt: new Date().toISOString(),
      CreatedBy: 'system',
      UpdatedAt: new Date().toISOString(),
      UpdatedBy: 'system',
      IsDeleted: false,
      // Define valores padrão para campos opcionais
      IsRealizado: data.IsRealizado ?? false,
      HasEscolta: data.HasEscolta ?? false,
      IsMovimentacaoExterna: data.IsMovimentacaoExterna ?? false,
      Observacao: data.Observacao ?? '',
      TipoAtendimento: data.TipoAtendimento ?? TipoAtendimento.JURIDICO,
    };

    // Inicializa o array de compromissos para o detento se não existir
    if (!_compromissos[detentoId]) {
      _compromissos[detentoId] = [];
    }

    // Adiciona o novo compromisso
    _compromissos[detentoId].push(novoCompromisso);

    return response({ compromisso: novoCompromisso }, STATUS.CREATED);
  } catch (error) {
    console.error('[Agenda API - create]: ', error);
    return response('Internal server error', STATUS.ERROR);
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const url = new URL(request.url);
    const compromissoId = url.pathname.split('/').pop();
    const detentoId = params.id;

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
    };

    // Atualiza o compromisso no array
    _compromissos[detentoId][compromissoIndex] = compromissoAtualizado;

    return response({ compromisso: compromissoAtualizado }, STATUS.OK);
  } catch (error) {
    console.error('[Agenda API - update]: ', error);
    return response('Internal server error', STATUS.ERROR);
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const url = new URL(request.url);
    const compromissoId = url.pathname.split('/').pop();
    const detentoId = params.id;

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
    console.error('[Agenda API - delete]: ', error);
    return response('Internal server error', STATUS.ERROR);
  }
}
