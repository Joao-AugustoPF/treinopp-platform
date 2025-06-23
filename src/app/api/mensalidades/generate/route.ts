import { NextResponse } from 'next/server';
import { ID, Query, Client, Databases, Account } from 'node-appwrite';

import { STATUS, response as apiResponse } from 'src/utils/response';

import type { IMensalidade } from 'src/features/alunos/types/mensalidade';

// Transform Appwrite document to IMensalidade
function transformToIMensalidade(doc: any): IMensalidade {
  return {
    Id: doc.$id,
    AlunoId: doc.alunoId,
    PlanoId: doc.planoId,
    MesReferencia: doc.mesReferencia,
    DataVencimento: doc.dataVencimento,
    DataPagamento: doc.dataPagamento || null,
    Valor: doc.valor,
    Status: doc.status,
    FormaPagamento: doc.formaPagamento || null,
    Observacoes: doc.observacoes || null,
    PagamentoId: doc.pagamentoId || null,
    TenantId: doc.tenantId,
    CreatedAt: doc.$createdAt,
    UpdatedAt: doc.$updatedAt,
    CreatedBy: doc.createdBy || '',
    UpdatedBy: doc.updatedBy || '',
  };
}

// POST - Gerar mensalidades automaticamente
export async function POST(request: Request) {
  try {
    // 1) Extrai o header Authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Authorization token missing or invalid' },
        { status: 401 }
      );
    }
    const token = authHeader.split(' ')[1];

    // 2) Instancia o client Appwrite já com o JWT
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
      .setJWT(token);

    const databases = new Databases(client);
    const account = new Account(client);
    const { alunoId, meses } = await request.json();

    // Validações iniciais
    if (!alunoId) {
      return apiResponse({ message: 'ID do aluno é obrigatório' }, STATUS.BAD_REQUEST);
    }

    if (!meses || meses <= 0 || meses > 12) {
      return apiResponse(
        { message: 'Número de meses deve ser entre 1 e 12' },
        STATUS.BAD_REQUEST
      );
    }

    // Buscar dados do usuário atual
    const user = await account.get();
    const currentUser = await databases.listDocuments('treinup', '682161970028be4664f2', [
      Query.equal('userId', user.$id),
      Query.limit(1),
    ]);

    if (!currentUser.documents.length) {
      return apiResponse({ message: 'Usuário não encontrado' }, STATUS.BAD_REQUEST);
    }

    const currentUserProfile = currentUser.documents[0];
    const tenantId = currentUserProfile.tenantId;

    // Verificar se o aluno existe
    const aluno = await databases.getDocument(
      'treinup',
      '682161970028be4664f2',
      alunoId
    );

    if (!aluno) {
      return apiResponse('Aluno não encontrado', STATUS.NOT_FOUND);
    }

    // Verificar se é um aluno (role USER)
    if (aluno.role !== 'USER') {
      return apiResponse('Perfil não é um aluno', STATUS.BAD_REQUEST);
    }

    // Buscar subscription ativa do aluno
    const subscriptions = await databases.listDocuments('treinup', 'subscriptions', [
      Query.equal('profileId', alunoId),
      Query.equal('isActive', true),
      Query.limit(1),
    ]);

    if (!subscriptions.documents.length) {
      return apiResponse(
        { message: 'Aluno não possui plano ativo' },
        STATUS.BAD_REQUEST
      );
    }

    const activeSubscription = subscriptions.documents[0];
    const planId = activeSubscription.planId.$id;

    // Buscar informações do plano
    const plano = await databases.getDocument(
      'treinup',
      'plans', // Collection ID correto
      planId
    );

    if (!plano) {
      return apiResponse('Plano não encontrado', STATUS.NOT_FOUND);
    }

    // Buscar mensalidades existentes para o aluno
    const existingMensalidades = await databases.listDocuments('treinup', 'mensalidades', [
      Query.equal('alunoId', alunoId),
    ]);

    // Criar mensalidades para os próximos meses
    const mensalidadesCriadas: IMensalidade[] = [];
    const hoje = new Date();
    const dataInicio = new Date(activeSubscription.startDate);
    
    for (let i = 0; i < meses; i++) {
      // Calcular o mês de referência baseado na data atual
      const mesReferencia = new Date(hoje.getFullYear(), hoje.getMonth() + i, 1);
      const mesReferenciaString = mesReferencia.toISOString().slice(0, 7); // YYYY-MM
      
      // Verificar se já existe mensalidade para este mês
      const existeParaEsteMes = existingMensalidades.documents.some(
        (m) => m.mesReferencia === mesReferenciaString
      );

      if (!existeParaEsteMes) {
        // Definir data de vencimento (dia 5 por padrão ou baseado na data de início da subscription)
        const diaVencimento = dataInicio.getDate();
        const dataVencimento = new Date(
          mesReferencia.getFullYear(),
          mesReferencia.getMonth(),
          diaVencimento
        );

        // Se o dia não existe no mês (ex: 31 em fevereiro), ajustar para o último dia do mês
        if (dataVencimento.getMonth() !== mesReferencia.getMonth()) {
          dataVencimento.setDate(0); // Vai para o último dia do mês anterior
        }

        // Criar mensalidade
        const novaMensalidade = await databases.createDocument(
          'treinup',
          'mensalidades',
          ID.unique(),
          {
            alunoId,
            planoId: planId,
            mesReferencia: mesReferenciaString,
            dataVencimento: dataVencimento.toISOString(),
            valor: plano.price, // Campo price no plano
            status: 'PENDENTE',
            observacoes: `Mensalidade gerada automaticamente para ${mesReferenciaString}`,
            tenantId,
            createdBy: user.$id,
            updatedBy: user.$id,
          }
        );

        mensalidadesCriadas.push(transformToIMensalidade(novaMensalidade));
      }
    }

    return apiResponse(
      {
        message: `${mensalidadesCriadas.length} mensalidades criadas com sucesso`,
        mensalidades: mensalidadesCriadas,
        total: mensalidadesCriadas.length,
      },
      STATUS.CREATED
    );
  } catch (error) {
    console.error('[Mensalidades - generate]: ', error);
    return apiResponse('Erro ao gerar mensalidades', STATUS.ERROR);
  }
} 