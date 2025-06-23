import { NextResponse } from 'next/server';
import { ID, Query, Client, Databases, Account } from 'node-appwrite';

import { STATUS, response as apiResponse } from 'src/utils/response';

import { createSessionClient } from 'src/lib/server/appwrite';

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

// GET - Listar mensalidades do aluno
export async function GET(request: Request, { params }: { params: { id: string } }) {
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

    // Verificar se o aluno existe
    const aluno = await databases.getDocument(
      'treinup',
      '682161970028be4664f2', // Profiles collection
      params.id
    );

    if (!aluno) {
      return apiResponse('Aluno não encontrado', STATUS.NOT_FOUND);
    }

    // Verificar se é um aluno (role USER)
    if (aluno.role !== 'USER') {
      return apiResponse('Perfil não é um aluno', STATUS.BAD_REQUEST);
    }

    // Buscar mensalidades do aluno
    const mensalidades = await databases.listDocuments(
      'treinup',
      'mensalidades', // Collection ID para mensalidades
      [
        Query.equal('alunoId', params.id),
        Query.orderDesc('mesReferencia'),
      ]
    );

    const transformedMensalidades = mensalidades.documents.map(transformToIMensalidade);

    return apiResponse({ mensalidades: transformedMensalidades }, STATUS.OK);
  } catch (error) {
    console.error('[Mensalidades - list]: ', error);
    return apiResponse('Erro ao listar mensalidades', STATUS.ERROR);
  }
}

// POST - Criar nova mensalidade para o aluno
export async function POST(request: Request, { params }: { params: { id: string } }) {
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
    const mensalidadeData = await request.json();

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
      params.id
    );

    if (!aluno) {
      return apiResponse('Aluno não encontrado', STATUS.NOT_FOUND);
    }

    // Verificar se é um aluno (role USER)
    if (aluno.role !== 'USER') {
      return apiResponse('Perfil não é um aluno', STATUS.BAD_REQUEST);
    }

    // Validações
    if (!mensalidadeData.MesReferencia) {
      return apiResponse({ message: 'Mês de referência é obrigatório' }, STATUS.BAD_REQUEST);
    }

    if (!mensalidadeData.DataVencimento) {
      return apiResponse({ message: 'Data de vencimento é obrigatória' }, STATUS.BAD_REQUEST);
    }

    if (!mensalidadeData.Valor || mensalidadeData.Valor <= 0) {
      return apiResponse({ message: 'Valor deve ser maior que zero' }, STATUS.BAD_REQUEST);
    }

    // Verificar se já existe mensalidade para o mesmo mês
    const existingMensalidade = await databases.listDocuments('treinup', 'mensalidades', [
      Query.equal('alunoId', params.id),
      Query.equal('mesReferencia', mensalidadeData.MesReferencia),
      Query.limit(1),
    ]);

    if (existingMensalidade.documents.length > 0) {
      return apiResponse(
        { message: 'Já existe mensalidade para este mês' },
        STATUS.BAD_REQUEST
      );
    }

    // Buscar subscription ativa do aluno para obter o plano
    const subscriptions = await databases.listDocuments('treinup', 'subscriptions', [
      Query.equal('profileId', params.id),
      Query.equal('isActive', true),
      Query.limit(1),
    ]);

    let planId = mensalidadeData.PlanoId; // Pode vir do frontend

    // Se não vier plano específico, usar o plano ativo da subscription
    if (!planId && subscriptions.documents.length > 0) {
      planId = subscriptions.documents[0].planId.$id;
    }

    if (!planId) {
      return apiResponse(
        { message: 'Plano deve ser especificado ou aluno deve ter plano ativo' },
        STATUS.BAD_REQUEST
      );
    }

    // Criar mensalidade
    const newMensalidade = await databases.createDocument(
      'treinup',
      'mensalidades',
      ID.unique(),
      {
        alunoId: params.id,
        planoId: planId,
        mesReferencia: mensalidadeData.MesReferencia,
        dataVencimento: new Date(mensalidadeData.DataVencimento).toISOString(),
        valor: mensalidadeData.Valor,
        status: 'PENDENTE',
        observacoes: mensalidadeData.Observacoes || null,
        tenantId,
        createdBy: user.$id,
        updatedBy: user.$id,
      }
    );

    return apiResponse(
      {
        message: 'Mensalidade criada com sucesso',
        mensalidade: transformToIMensalidade(newMensalidade),
      },
      STATUS.CREATED
    );
  } catch (error) {
    console.error('[Mensalidades - create]: ', error);
    return apiResponse('Erro ao criar mensalidade', STATUS.ERROR);
  }
} 