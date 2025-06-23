import type { ITreinador } from 'src/features/treinadores/treinador/types';

import { Client, Databases, Query } from 'node-appwrite';
import { NextResponse, type NextRequest } from 'next/server';

import { STATUS, response as apiResponse } from 'src/utils/response';

import { createSessionClient } from 'src/lib/server/appwrite';

// Transform Appwrite document to ITreinador
function transformToITreinador(doc: any): ITreinador {
  return {
    Id: doc.$id,
    Nome: doc.name,
    Email: doc.email,
    Telefone: doc.phoneNumber,
    DataNascimento: doc.birthDate,
    Especialidades: [], // Campo não existe no Appwrite, deixar vazio
    Status: doc.status || 'ACTIVE',
    Foto: doc.avatarUrl,
    Biografia: '', // Campo não existe no Appwrite
    Certificacoes: [], // Campo não existe no Appwrite
    HorariosDisponiveis: '', // Campo não existe no Appwrite
    CreatedAt: doc.$createdAt,
    CreatedBy: doc.$createdBy,
    UpdatedAt: doc.$updatedAt,
    UpdatedBy: doc.$updatedBy,
    IsDeleted: false,
    FotoPerfil: doc.avatarUrl,
    CPF: doc.cpf,
    Endereco: {
      Cep: doc.addressZip,
      Logradouro: doc.addressStreet,
      Numero: doc.addressNumber,
      Complemento: doc.addressComplement,
      Bairro: doc.addressNeighborhood,
      Cidade: doc.addressCity,
      Estado: doc.addressState,
    },
  };
}

export const runtime = 'edge';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  // 1) Extrai o header Authorization
  const authHeader = req.headers.get('authorization');
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

    const treinador = await databases.getDocument(
      'treinup',
      '682161970028be4664f2', // Profiles collection
      params.id
    );

    // Verificar se o perfil é um treinador
    if (treinador.role !== 'TRAINER' && treinador.role !== 'OWNER') {
      return apiResponse({ message: 'Perfil não é um treinador' }, STATUS.FORBIDDEN);
    }

    return apiResponse({ treinador: transformToITreinador(treinador) }, STATUS.OK);
  } catch (error) {
    console.error('[Treinador - get]: ', error);
    return apiResponse({ message: 'Erro ao buscar treinador' }, STATUS.ERROR);
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // 1) Extrai o header Authorization
    const authHeader = req.headers.get('authorization');
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
    const data = await req.json();

    // Primeiro, verificar se o perfil existe e é um treinador
    const existingProfile = await databases.getDocument(
      'treinup',
      '682161970028be4664f2', // Profiles collection
      params.id
    );

    if (!existingProfile) {
      return apiResponse({ message: 'Treinador não encontrado' }, STATUS.NOT_FOUND);
    }

    if (existingProfile.role !== 'TRAINER' && existingProfile.role !== 'OWNER') {
      return apiResponse({ message: 'Perfil não é um treinador' }, STATUS.FORBIDDEN);
    }

    // Verificar se o email já existe em outro perfil (exceto o atual)
    if (data.Email && data.Email !== existingProfile.email) {
      const emailCheck = await databases.listDocuments('treinup', '682161970028be4664f2', [
        Query.equal('email', data.Email),
      ]);

      if (emailCheck.documents.length > 0) {
        return apiResponse({ message: 'Já existe um perfil com este email' }, STATUS.CONFLICT);
      }
    }

    // Validações
    if (!data.Nome) {
      return apiResponse({ message: 'Nome do treinador é obrigatório' }, STATUS.BAD_REQUEST);
    }

    if (!data.Email) {
      return apiResponse({ message: 'Email do treinador é obrigatório' }, STATUS.BAD_REQUEST);
    }

    if (!data.Telefone) {
      return apiResponse({ message: 'Telefone do treinador é obrigatório' }, STATUS.BAD_REQUEST);
    }

    if (!data.DataNascimento) {
      return apiResponse(
        { message: 'Data de nascimento do treinador é obrigatória' },
        STATUS.BAD_REQUEST
      );
    }

    if (!data.Endereco?.Logradouro) {
      return apiResponse({ message: 'Endereço do treinador é obrigatório' }, STATUS.BAD_REQUEST);
    }

    // Validar status se fornecido
    if (data.Status && !['ACTIVE', 'INACTIVE', 'PENDING', 'BLOCKED'].includes(data.Status)) {
      return apiResponse({ message: 'Status inválido' }, STATUS.BAD_REQUEST);
    }

    // Transform ITreinador to Appwrite document format
    const appwriteData = {
      name: data.Nome,
      email: data.Email,
      phoneNumber: data.Telefone,
      birthDate: data.DataNascimento,
      cpf: data.CPF,
      status: data.Status || 'ACTIVE',
      avatarUrl: data.Foto,
      addressStreet: data.Endereco.Logradouro,
      addressNumber: data.Endereco.Numero,
      addressComplement: data.Endereco.Complemento,
      addressNeighborhood: data.Endereco.Bairro,
      addressCity: data.Endereco.Cidade,
      addressState: data.Endereco.Estado,
      addressZip: data.Endereco.Cep,
      // Manter o role como TRAINER
      role: 'TRAINER',
    };

    const updatedTreinador = await databases.updateDocument(
      'treinup',
      '682161970028be4664f2', // Profiles collection
      params.id,
      appwriteData
    );

    return apiResponse(
      {
        message: 'Treinador atualizado com sucesso',
        treinador: transformToITreinador(updatedTreinador),
      },
      STATUS.OK
    );
  } catch (error) {
    console.error('[Treinador - update]: ', error);
    return apiResponse({ message: 'Erro ao atualizar treinador' }, STATUS.ERROR);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // 1) Extrai o header Authorization
    const authHeader = req.headers.get('authorization');
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

    // Primeiro, verificar se o perfil existe e é um treinador
    const existingProfile = await databases.getDocument(
      'treinup',
      '682161970028be4664f2', // Profiles collection
      params.id
    );

    if (!existingProfile) {
      return apiResponse({ message: 'Treinador não encontrado' }, STATUS.NOT_FOUND);
    }

    if (existingProfile.role !== 'TRAINER' && existingProfile.role !== 'OWNER') {
      return apiResponse({ message: 'Perfil não é um treinador' }, STATUS.FORBIDDEN);
    }

    await databases.deleteDocument(
      'treinup',
      '682161970028be4664f2', // Profiles collection
      params.id
    );

    return apiResponse({ message: 'Treinador excluído com sucesso' }, STATUS.OK);
  } catch (error) {
    console.error('[Treinador - delete]: ', error);
    return apiResponse({ message: 'Erro ao excluir treinador' }, STATUS.ERROR);
  }
}
