import { Client, Databases } from 'node-appwrite';
import { NextResponse, type NextRequest } from 'next/server';

import { STATUS, response as apiResponse } from 'src/utils/response';

// Transform Appwrite document to IAcademia
function transformToIAcademia(doc: any) {
  return {
    Id: doc.$id,
    Name: doc.name,
    Email: doc.email,
    LogoUrl: doc.logoUrl,
    Phone: doc.phone,
    AddressStreet: doc.addressStreet,
    AddressNumber: doc.addressNumber,
    AddressComplement: doc.addressComplement,
    AddressCity: doc.addressCity,
    AddressState: doc.addressState,
    AddressZip: doc.addressZip,
    PaymentGateway: doc.paymentGateway,
    GatewayKey: doc.gatewayKey,
    Permissions: doc.permissions || [],
    Slug: doc.slug,
    TenantId: doc.tenantId,
  };
}

export const runtime = 'edge';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json(
      { message: 'Authorization token missing or invalid' },
      { status: 401 }
    );
  }
  const token = authHeader.split(' ')[1];

  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
      .setJWT(token);

    const databases = new Databases(client);

    const academia = await databases.getDocument(
      'treinup',
      'academies', // Academies collection
      params.id
    );

    if (!academia) {
      return apiResponse('Academia não encontrada', STATUS.NOT_FOUND);
    }

    return apiResponse({ academia: transformToIAcademia(academia) }, STATUS.OK);
  } catch (error) {
    console.error('[Academias - get]: ', error);
    return apiResponse('Internal server error', STATUS.ERROR);
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json(
      { message: 'Authorization token missing or invalid' },
      { status: 401 }
    );
  }
  const token = authHeader.split(' ')[1];

  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
      .setJWT(token);

    const databases = new Databases(client);
    const academia = await req.json();

    // Update the academia in Appwrite
    const updatedAcademia = await databases.updateDocument(
      'treinup',
      'academies', // Academies collection
      params.id,
      {
        name: academia.Name,
        logoUrl: academia.LogoUrl,
        phone: academia.Phone,
        addressStreet: academia.AddressStreet,
        addressNumber: academia.AddressNumber,
        addressComplement: academia.AddressComplement,
        addressCity: academia.AddressCity,
        addressState: academia.AddressState,
        addressZip: academia.AddressZip,
        paymentGateway: academia.PaymentGateway,
        gatewayKey: academia.GatewayKey,
        // permissions: academia.Permissions,
        slug: academia.Slug,
        tenantId: academia.TenantId,
      }
    );

    // Transform the updated academia back to IAcademia format
    const transformedAcademia = transformToIAcademia(updatedAcademia);

    return apiResponse({ academia: transformedAcademia }, STATUS.OK);
  } catch (error) {
    console.error('[Academias - update]: ', error);
    return apiResponse('Internal server error', STATUS.ERROR);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json(
      { message: 'Authorization token missing or invalid' },
      { status: 401 }
    );
  }
  const token = authHeader.split(' ')[1];

  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
      .setJWT(token);

    const databases = new Databases(client);

    // First check if the academia exists
    const existingAcademia = await databases.getDocument(
      'treinup',
      'academies',
      params.id
    );

    if (!existingAcademia) {
      return apiResponse('Academia não encontrada', STATUS.NOT_FOUND);
    }

    await databases.deleteDocument(
      'treinup',
      'academies', // Academies collection
      params.id
    );

    return apiResponse({ message: 'Academia excluída com sucesso' }, STATUS.OK);
  } catch (error) {
    console.error('[Academias - delete]: ', error);
    return apiResponse('Internal server error', STATUS.ERROR);
  }
}
