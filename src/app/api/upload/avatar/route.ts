import { Client, Storage, ID } from 'node-appwrite';

import { NextResponse, type NextRequest } from 'next/server';

import { STATUS, response as apiResponse } from 'src/utils/response';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
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
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
      .setJWT(token);

    const storage = new Storage(client);
    console.log('[Upload Avatar] - Client Appwrite configurado');

    // 2) Extrai o arquivo do FormData
    console.log('[Upload Avatar] - Processando FormData...');
    const formData = await req.formData();

    // Debug: Log dos campos do FormData
    const formDataKeys = Array.from(formData.keys());
    console.log('[Upload Avatar] - FormData fields:', formDataKeys);

    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;

    console.log(
      '[Upload Avatar] - File:',
      file
        ? {
            name: file.name,
            size: file.size,
            type: file.type,
          }
        : 'null'
    );
    console.log('[Upload Avatar] - UserId:', userId);

    if (!file) {
      console.error('[Upload Avatar] - Arquivo não encontrado no FormData');
      return apiResponse('Arquivo não fornecido', STATUS.BAD_REQUEST);
    }

    if (!userId) {
      console.error('[Upload Avatar] - UserId não encontrado no FormData');
      return apiResponse('ID do usuário não fornecido', STATUS.BAD_REQUEST);
    }

    // 3) Valida o tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      console.error('[Upload Avatar] - Tipo de arquivo não permitido:', file.type);
      return apiResponse(
        'Tipo de arquivo não permitido. Use apenas JPEG, JPG ou PNG',
        STATUS.BAD_REQUEST
      );
    }

    // 4) Valida o tamanho do arquivo (5MB máximo)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      console.error('[Upload Avatar] - Arquivo muito grande:', file.size);
      return apiResponse('Arquivo muito grande. Tamanho máximo: 5MB', STATUS.BAD_REQUEST);
    }

    console.log('[Upload Avatar] - Uploading file:', file.size);

    // 5) Faz upload seguindo o padrão do exemplo Appwrite
    const result = await storage.createFile(
      '6826471c0028818bedbc', // bucketId
      ID.unique(), // fileId - usando ID único gerado pelo Appwrite
      file, // file
      ['read("any")'] // permissions - permitindo leitura para qualquer usuário
    );

    console.log('result', result);

    // 6) Retorna a URL do arquivo
    const fileId = await storage.getFileView('6826471c0028818bedbc', result.$id);
    console.log('fileUrl', fileId);
    console.log('[Upload Avatar] - File uploaded successfully:', result.$id);
    const fileUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/6826471c0028818bedbc/files/${result.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
    return apiResponse(
      {
        fileId: result.$id,
        fileName: result.name,
        fileUrl,
        message: 'Avatar enviado com sucesso',
      },
      STATUS.OK
    );
  } catch (error) {
    console.error('[Upload Avatar] - Erro:', error);
    return apiResponse('Erro interno do servidor', STATUS.ERROR);
  }
}

export async function DELETE(req: NextRequest) {
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
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
      .setJWT(token);

    const storage = new Storage(client);

    // 3) Extrai o fileId da query string
    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get('fileId');

    if (!fileId) {
      return apiResponse('ID do arquivo não fornecido', STATUS.BAD_REQUEST);
    }

    // 4) Deleta o arquivo do bucket
    await storage.deleteFile('6826471c0028818bedbc', fileId);

    return apiResponse({ message: 'Avatar excluído com sucesso' }, STATUS.OK);
  } catch (error) {
    console.error('[Delete Avatar]: ', error);
    return apiResponse('Erro interno do servidor', STATUS.ERROR);
  }
}
