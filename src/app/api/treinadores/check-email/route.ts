import type { ITreinador } from 'src/features/treinadores/treinador/types';

import { NextRequest } from 'next/server';
import { Query, Client, Databases } from 'node-appwrite';

import { STATUS, response as apiResponse } from 'src/utils/response';

// Transform Appwrite document to ITreinador
function transformToITreinador(doc: any): ITreinador {
  return {
    Id: doc.$id,
    Nome: doc.name,
    Email: doc.email,
    Telefone: doc.phoneNumber,
    DataNascimento: doc.birthDate,
    Especialidades: [],
    Status: doc.status || 'ACTIVE',
    Foto: doc.avatarUrl,
    Biografia: '',
    Certificacoes: [],
    HorariosDisponiveis: '',
    CreatedAt: doc.$createdAt,
    CreatedBy: doc.$createdBy,
    UpdatedAt: doc.$updatedAt,
    UpdatedBy: doc.$updatedBy,
    IsDeleted: false,
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

// ----------------------------------------------------------------------

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get('email');

    if (!email) {
      return apiResponse({ message: 'Email parameter is required' }, STATUS.BAD_REQUEST);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return apiResponse({ message: 'Invalid email format' }, STATUS.BAD_REQUEST);
    }

    // Use client with API key for public access
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
      .setKey(process.env.APPWRITE_API_KEY!);

    const databases = new Databases(client);

    // Check if a profile with this email already exists
    const response = await databases.listDocuments(
      'treinup',
      '682161970028be4664f2', // Profiles collection
      [Query.equal('email', email)]
    );

    const exists = response.documents.length > 0;
    const profile = exists ? response.documents[0] : null;

    return apiResponse(
      {
        exists,
        isTrainer: profile?.role === 'TRAINER',
        profile: profile ? transformToITreinador(profile) : null,
      },
      STATUS.OK
    );
  } catch (error) {
    console.error('[Email Check API]: ', error);
    return apiResponse({ message: 'Internal server error' }, STATUS.ERROR);
  }
}
