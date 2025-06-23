import { NextResponse } from 'next/server';
import { ID, Query, Client, Databases } from 'node-appwrite';

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
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!) // e.g. 'https://<REGION>.appwrite.io/v1'
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!) // seu Project ID
      .setJWT(token); // injeta o JWT

    const databases = new Databases(client);
    const { Plano: PlanoAtual } = await request.json();

    if (!PlanoAtual) {
      return NextResponse.json(
        { error: 'Nenhum plano fornecido para atualização' },
        { status: 400 }
      );
    }

    // Get the current profile to check if it exists
    const currentProfile = await databases.getDocument(
      'treinup',
      '682161970028be4664f2', // Profiles collection
      params.id
    );

    if (!currentProfile) {
      return NextResponse.json({ error: 'Aluno não encontrado' }, { status: 404 });
    }

    // Check for existing active subscription
    const existingSubscription = await databases.listDocuments('treinup', 'subscriptions', [
      Query.equal('profileId', params.id),
      Query.equal('isActive', true),
    ]);

    let subscription;
    if (existingSubscription.documents.length > 0) {
      // Update existing subscription
      subscription = await databases.updateDocument(
        'treinup',
        'subscriptions',
        existingSubscription.documents[0].$id,
        {
          planId: PlanoAtual.Id,
          endDate: new Date(PlanoAtual.DataFim).toISOString(),
        }
      );
    } else {
      // Create new subscription
      subscription = await databases.createDocument('treinup', 'subscriptions', ID.unique(), {
        profileId: params.id,
        planId: PlanoAtual.Id,
        startDate: new Date().toISOString(),
        endDate: new Date(PlanoAtual.DataFim).toISOString(),
        isActive: true,
        tenantId: currentProfile.tenantId,
      });
    }

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error('Error updating aluno plan:', error);
    return NextResponse.json({ error: 'Failed to update aluno plan' }, { status: 500 });
  }
}
