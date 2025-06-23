import { NextResponse } from 'next/server';
import { Client, Databases } from 'node-appwrite';

import { STATUS, response as apiResponse } from 'src/utils/response';

import { createSessionClient } from 'src/lib/server/appwrite';

export async function PUT(
  request: Request,
  { params }: { params: { paymentIdParam: string; paymentId: string } }
) {
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
    const payment = await request.json();

    // Get the current profile to check if it exists
    const currentProfile = await databases.getDocument(
      'treinup',
      '682161970028be4664f2', // Profiles collection
      params.paymentIdParam
    );

    if (!currentProfile) {
      return apiResponse('Aluno não encontrado', STATUS.NOT_FOUND);
    }

    // Get the payment to check if it exists and belongs to the student
    const currentPayment = await databases.getDocument(
      'treinup',
      '68227b900005e53f0bdf', // Payments collection
      params.paymentId
    );

    if (!currentPayment) {
      return apiResponse('Pagamento não encontrado', STATUS.NOT_FOUND);
    }

    if (currentPayment.memberProfileId !== params.paymentIdParam) {
      return apiResponse('Pagamento não pertence a este aluno', STATUS.FORBIDDEN);
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
      '682161970028be4664f2', // Profiles collection
      params.id
    );

    if (!currentProfile) {
      return apiResponse('Aluno não encontrado', STATUS.NOT_FOUND);
    }

    // Get the payment to check if it exists and belongs to the student
    const currentPayment = await databases.getDocument(
      'treinup',
      '68227b900005e53f0bdf', // Payments collection
      params.paymentId
    );

    if (!currentPayment) {
      return apiResponse('Pagamento não encontrado', STATUS.NOT_FOUND);
    }

    if (currentPayment.memberProfileId !== params.id) {
      return apiResponse('Pagamento não pertence a este aluno', STATUS.FORBIDDEN);
    }

    // Delete payment record
    await databases.deleteDocument('treinup', '68227b900005e53f0bdf', params.paymentId);

    return apiResponse({ success: true }, STATUS.OK);
  } catch (error) {
    console.error('[Alunos - delete payment]: ', error);
    return apiResponse('Internal server error', STATUS.ERROR);
  }
}
