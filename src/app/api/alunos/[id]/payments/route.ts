import { NextResponse } from 'next/server';
import { ID, Query, Client, Databases } from 'node-appwrite';

import { verify } from 'src/utils/jwt';
import { STATUS, response as apiResponse } from 'src/utils/response';

import { JWT_SECRET } from 'src/_mock/_auth';
import { createSessionClient } from 'src/lib/server/appwrite';

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

    await verify(token, JWT_SECRET);

    // 2) Instancia o client Appwrite já com o JWT
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!) // e.g. 'https://<REGION>.appwrite.io/v1'
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!) // seu Project ID
      .setJWT(token); // injeta o JWT

    const databases = new Databases(client);
    const payment = await request.json();

    console.log('payment', payment);

    // Get the current profile to check if it exists and get tenantId
    const currentProfile = await databases.getDocument(
      'treinup',
      '682161970028be4664f2', // Profiles collection
      params.id
    );

    if (!currentProfile) {
      return apiResponse('Aluno não encontrado', STATUS.NOT_FOUND);
    }

    // Create payment record
    const newPayment = await databases.createDocument(
      'treinup',
      '68227b900005e53f0bdf',
      ID.unique(),
      {
        tenantId: currentProfile.tenantId,
        gateway: payment.gateway,
        gatewayRef: payment.gatewayRef,
        status: payment.status,
        amount: payment.amount,
        currency: payment.currency,
        paidAt: new Date(payment.paidAt).toISOString(),
        memberProfileId: params.id,
      }
    );

    return apiResponse({ payment: newPayment }, STATUS.OK);
  } catch (error) {
    console.error('[Alunos - payment]: ', error);
    return apiResponse('Internal server error', STATUS.ERROR);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string; paymentId: string } }
) {
  try {
    const client = await createSessionClient();
    const databases = client.databases;
    const payment = await request.json();

    // Get the current profile to check if it exists
    const currentProfile = await databases.getDocument(
      'treinup',
      '682161970028be4664f2',
      params.id
    );

    if (!currentProfile) {
      return apiResponse('Aluno não encontrado', STATUS.NOT_FOUND);
    }

    // Update payment record
    const updatedPayment = await databases.updateDocument(
      'treinup',
      '68227b900005e53f0bdf',
      params.paymentId,
      {
        gateway: payment.gateway,
        gatewayRef: payment.gatewayRef,
        status: payment.status,
        amount: payment.amount,
        currency: payment.currency,
        paidAt: new Date(payment.paidAt).toISOString(),
      }
    );

    return apiResponse({ payment: updatedPayment }, STATUS.OK);
  } catch (error) {
    console.error('[Alunos - update payment]: ', error);
    return apiResponse('Internal server error', STATUS.ERROR);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; paymentId: string } }
) {
  try {
    const client = await createSessionClient();
    const databases = client.databases;

    // Get the current profile to check if it exists
    const currentProfile = await databases.getDocument(
      'treinup',
      '682161970028be4664f2',
      params.id
    );

    if (!currentProfile) {
      return apiResponse('Aluno não encontrado', STATUS.NOT_FOUND);
    }

    // Delete payment record
    await databases.deleteDocument('treinup', '68227b900005e53f0bdf', params.paymentId);

    return apiResponse({ success: true }, STATUS.OK);
  } catch (error) {
    console.error('[Alunos - delete payment]: ', error);
    return apiResponse('Internal server error', STATUS.ERROR);
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await createSessionClient();
    const databases = client.databases;

    // Get the current profile to check if it exists
    const currentProfile = await databases.getDocument(
      'treinup',
      '682161970028be4664f2', // Profiles collection
      params.id
    );

    if (!currentProfile) {
      return apiResponse('Aluno não encontrado', STATUS.NOT_FOUND);
    }

    // Get all payments for this student
    const payments = await databases.listDocuments('treinup', '68227b900005e53f0bdf', [
      Query.equal('memberProfileId', params.id),
      Query.orderDesc('$createdAt'),
    ]);

    return apiResponse({ payments: payments.documents }, STATUS.OK);
  } catch (error) {
    console.error('[Alunos - get payments]: ', error);
    return apiResponse('Internal server error', STATUS.ERROR);
  }
}
