import type { IPlan } from 'src/features/gym-plans/types/plan';

import { NextResponse } from 'next/server';
import { Client, Databases } from 'node-appwrite';

import { STATUS, response } from 'src/utils/response';

import { createSessionClient } from 'src/lib/server/appwrite';

// Transform Appwrite document to IPlan
function transformToIPlan(doc: any): IPlan {
  return {
    Id: doc.$id,
    Nome: doc.name,
    Valor: doc.price,
    Duracao: doc.durationDays,
    CreatedAt: doc.$createdAt,
    UpdatedAt: doc.$updatedAt,
  };
}

// ----------------------------------------------------------------------

export const runtime = 'edge';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  // 1) Extrai o header Authorization
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json(
      { message: 'Authorization token missing or invalid' },
      { status: 401 }
    );
  }
  const token = authHeader.split(' ')[1];
  try {
    // 2) Instancia o client Appwrite já com o JWT
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!) // e.g. 'https://<REGION>.appwrite.io/v1'
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!) // seu Project ID
      .setJWT(token); // injeta o JWT
    const databases = new Databases(client);
    const data = await request.json();

    // Validações
    if (data.Nome === undefined || data.Nome === '') {
      return response({ message: 'Nome do plano é obrigatório' }, STATUS.BAD_REQUEST);
    }

    if (data.Valor === undefined || data.Valor < 0) {
      return response(
        { message: 'Valor do plano é obrigatório e deve ser maior ou igual a 0' },
        STATUS.BAD_REQUEST
      );
    }

    if (data.Duracao === undefined || data.Duracao < 30) {
      return response(
        { message: 'Duração do plano é obrigatória e deve ser maior ou igual a 30 dias' },
        STATUS.BAD_REQUEST
      );
    }

    if (!data.TenantId) {
      return response({ message: 'Tenant ID é obrigatório' }, STATUS.BAD_REQUEST);
    }

    // Transform to Appwrite document format
    const appwriteData = {
      name: data.Nome,
      price: data.Valor,
      durationDays: data.Duracao,
      tenantId: data.TenantId,
    };

    const updatedPlan = await databases.updateDocument('treinup', 'plans', params.id, appwriteData);

    return response({ plan: transformToIPlan(updatedPlan) }, STATUS.OK);
  } catch (error) {
    console.error('[Plans - update]: ', error);
    return response({ message: 'Erro ao atualizar plano' }, STATUS.ERROR);
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await createSessionClient();
    const databases = client.databases;

    // Check if plan exists before deleting
    try {
      await databases.getDocument('treinup', 'plans', params.id);
    } catch (error) {
      console.log(error)
      return response({ message: 'Plano não encontrado' }, STATUS.NOT_FOUND);
    }

    // Delete the plan
    await databases.deleteDocument('treinup', 'plans', params.id);

    return response({ message: 'Plano removido com sucesso' }, STATUS.OK);
  } catch (error) {
    console.error('[Plans - delete]: ', error);
    return response({ message: 'Erro ao remover plano' }, STATUS.ERROR);
  }
}
