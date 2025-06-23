import { NextResponse } from 'next/server';
import { Query, Client, Databases, Account } from 'node-appwrite';

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

// PUT - Atualizar mensalidade
export async function PUT(request: Request, { params }: { params: { id: string } }) {
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

    // Verificar se a mensalidade existe
    const mensalidade = await databases.getDocument(
      'treinup',
      'mensalidades',
      params.id
    );

    if (!mensalidade) {
      return apiResponse('Mensalidade não encontrada', STATUS.NOT_FOUND);
    }

    // Preparar dados para atualização
    const updateData: any = {
      updatedBy: user.$id,
    };

    // Campos que podem ser atualizados
    if (mensalidadeData.DataVencimento) {
      updateData.dataVencimento = new Date(mensalidadeData.DataVencimento).toISOString();
    }

    if (mensalidadeData.DataPagamento) {
      updateData.dataPagamento = new Date(mensalidadeData.DataPagamento).toISOString();
    }

    if (mensalidadeData.Valor) {
      updateData.valor = mensalidadeData.Valor;
    }

    if (mensalidadeData.Status) {
      updateData.status = mensalidadeData.Status;
    }

    if (mensalidadeData.FormaPagamento) {
      updateData.formaPagamento = mensalidadeData.FormaPagamento;
    }

    if (mensalidadeData.Observacoes !== undefined) {
      updateData.observacoes = mensalidadeData.Observacoes;
    }

    if (mensalidadeData.PagamentoId !== undefined) {
      updateData.pagamentoId = mensalidadeData.PagamentoId;
    }

    // Atualizar mensalidade
    const updatedMensalidade = await databases.updateDocument(
      'treinup',
      'mensalidades',
      params.id,
      updateData
    );

    return apiResponse(
      {
        message: 'Mensalidade atualizada com sucesso',
        mensalidade: transformToIMensalidade(updatedMensalidade),
      },
      STATUS.OK
    );
  } catch (error) {
    console.error('[Mensalidades - update]: ', error);
    return apiResponse('Erro ao atualizar mensalidade', STATUS.ERROR);
  }
}

// DELETE - Deletar mensalidade
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
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

    // Verificar se a mensalidade existe
    const mensalidade = await databases.getDocument(
      'treinup',
      'mensalidades',
      params.id
    );

    if (!mensalidade) {
      return apiResponse('Mensalidade não encontrada', STATUS.NOT_FOUND);
    }

    // Deletar mensalidade
    await databases.deleteDocument(
      'treinup',
      'mensalidades',
      params.id
    );

    return apiResponse(
      { message: 'Mensalidade deletada com sucesso' },
      STATUS.OK
    );
  } catch (error) {
    console.error('[Mensalidades - delete]: ', error);
    return apiResponse('Erro ao deletar mensalidade', STATUS.ERROR);
  }
} 