import type { IAluno } from 'src/features/alunos/types';

import { NextResponse } from 'next/server';
import { ID, Query, Client, Databases } from 'node-appwrite';

import { STATUS, response as apiResponse } from 'src/utils/response';

// Transform Appwrite document to IAluno
function transformToIAluno(doc: any, subscription?: any): IAluno {
  return {
    Id: doc.$id,
    Nome: doc.name,
    Email: doc.email,
    Telefone: doc.phoneNumber,
    DataNascimento: doc.birthDate,
    CPF: doc.cpf || '',
    Status: doc.status || 'Pendente',
    Foto: doc.avatarUrl,
    Endereco: {
      Logradouro: doc.addressStreet,
      Numero: doc.addressNumber,
      Complemento: doc.addressComplement,
      Bairro: doc.addressNeighborhood || '',
      Cidade: doc.addressCity,
      Estado: doc.addressState,
      CEP: doc.addressZip,
    },
    Plano: subscription
      ? {
          Id: subscription.planId.$id,
          Nome: subscription.planId?.name || 'Sem Plano',
          Valor: subscription.planId?.price || 0,
          DataInicio: new Date(subscription.startDate).toISOString(),
          DataFim: new Date(subscription.endDate).toISOString(),
        }
      : {
          Id: '',
          Nome: 'Sem Plano',
          Valor: 0,
          DataInicio: new Date().toISOString(),
          DataFim: new Date().toISOString(),
        },
    // TreinadorId: doc.trainerId,
    Treinador: doc.trainer
      ? {
          Id: doc.trainer.$id,
          Nome: doc.trainer.name,
        }
      : undefined,
    MaxBookings: doc.maxBookings || 0,
    CreatedAt: new Date(doc.$createdAt).toISOString(),
    UpdatedAt: new Date(doc.$updatedAt).toISOString(),
  };
}

export const runtime = 'edge';

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
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!) // e.g. 'https://<REGION>.appwrite.io/v1'
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!) // seu Project ID
      .setJWT(token); // injeta o JWT

    const databases = new Databases(client);

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
      return apiResponse('Perfil não é um aluno', STATUS.FORBIDDEN);
    }

    const subscription = await databases.listDocuments('treinup', 'subscriptions', [
      Query.equal('profileId', params.id),
      Query.equal('isActive', true),
    ]);

    return apiResponse({ aluno: transformToIAluno(aluno, subscription.documents[0]) }, STATUS.OK);
  } catch (error) {
    console.error('[Alunos - get]: ', error);
    return apiResponse('Internal server error', STATUS.ERROR);
  }
}

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
    const aluno = await request.json();

    console.log('Updating aluno:', aluno);

    console.log('params.id', params.id);

    // Verificar se o perfil existe e é um aluno
    const existingAluno = await databases.getDocument(
      'treinup',
      '682161970028be4664f2', // Profiles collection
      params.id
    );

    if (!existingAluno) {
      return apiResponse('Aluno não encontrado', STATUS.NOT_FOUND);
    }

    if (existingAluno.role !== 'USER') {
      return apiResponse('Perfil não é um aluno', STATUS.FORBIDDEN);
    }

    // Update the profile in Appwrite
    const updatedProfile = await databases.updateDocument(
      'treinup',
      '682161970028be4664f2', // Profiles collection
      params.id,
      {
        name: aluno.Nome,
        email: aluno.Email,
        phoneNumber: aluno.Telefone,
        birthDate: aluno.DataNascimento,
        cpf: aluno.CPF || '',
        status: aluno.Status,
        avatarUrl: aluno.Foto || null,
        addressStreet: aluno.Endereco.Logradouro,
        addressNumber: aluno.Endereco.Numero,
        addressComplement: aluno.Endereco.Complemento || '',
        addressNeighborhood: aluno.Endereco.Bairro,
        addressCity: aluno.Endereco.Cidade,
        addressState: aluno.Endereco.Estado,
        addressZip: aluno.Endereco.CEP,
        maxBookings: aluno.MaxBookings || 0,
        // trainerId: aluno.TreinadorId || null,
        tenantId: existingAluno.tenantId, // Mantém o tenantId original
      }
    );

    // If there's a plan update, create or update the subscription
    if (aluno.Plano?.Id) {
      const existingSubscription = await databases.listDocuments('treinup', 'subscriptions', [
        Query.equal('profileId', params.id),
        Query.equal('isActive', true),
      ]);

      if (existingSubscription.documents.length > 0) {
        // Update existing subscription
        await databases.updateDocument(
          'treinup',
          'subscriptions',
          existingSubscription.documents[0].$id,
          {
            planId: aluno.Plano.Id,
            startDate: aluno.Plano.DataInicio,
            endDate: aluno.Plano.DataFim,
            isActive: true,
            tenantId: existingAluno.tenantId, // Mantém o tenantId original
          }
        );
      } else {
        // Create new subscription
        await databases.createDocument('treinup', 'subscriptions', ID.unique(), {
          profileId: params.id,
          planId: aluno.Plano.Id,
          startDate: aluno.Plano.DataInicio,
          endDate: aluno.Plano.DataFim,
          isActive: true,
          tenantId: existingAluno.tenantId, // Mantém o tenantId original
        });
      }
    }

    // Get the updated subscription
    const subscription = await databases.listDocuments('treinup', 'subscriptions', [
      Query.equal('profileId', params.id),
      Query.equal('isActive', true),
    ]);

    // Transform the updated profile back to IAluno format
    const transformedAluno = transformToIAluno(updatedProfile, subscription.documents[0]);

    return apiResponse({ aluno: transformedAluno }, STATUS.OK);
  } catch (error) {
    console.error('[Alunos - update]: ', error);
    return apiResponse('Erro ao atualizar aluno', STATUS.ERROR);
  }
}

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

    // Primeiro verificar se o perfil existe e é um aluno
    const existingAluno = await databases.getDocument('treinup', '682161970028be4664f2', params.id);

    if (!existingAluno) {
      return apiResponse('Aluno não encontrado', STATUS.NOT_FOUND);
    }

    if (existingAluno.role !== 'USER') {
      return apiResponse('Perfil não é um aluno', STATUS.FORBIDDEN);
    }

    await databases.deleteDocument(
      'treinup',
      '682161970028be4664f2', // Profiles collection
      params.id
    );

    return apiResponse({ message: 'Aluno excluído com sucesso' }, STATUS.OK);
  } catch (error) {
    console.error('[Alunos - delete]: ', error);
    return apiResponse('Internal server error', STATUS.ERROR);
  }
}
