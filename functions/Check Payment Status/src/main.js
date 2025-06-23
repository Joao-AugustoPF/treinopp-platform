import { Client, Databases, Query, Messaging } from 'node-appwrite';

function daysBetween(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return Math.ceil((d1 - d2) / (1000 * 60 * 60 * 24));
}

async function sendPushNotification({
  client,
  userId,
  diasParaVencimento,
  mensalidadeId,
  status,
  dataVencimento,
  log,
  error,
}) {
  try {
    const messaging = new Messaging(client);
    // Mensagem personalizada
    let title = 'Aviso de Mensalidade';
    let body = '';
    if (diasParaVencimento > 0) {
      body = `Sua mensalidade vence em ${diasParaVencimento} dia(s): ${new Date(dataVencimento).toLocaleDateString('pt-BR')}`;
    } else if (diasParaVencimento === 0) {
      body = `Sua mensalidade vence hoje!`;
    } else {
      body = `Sua mensalidade está vencida! Regularize o pagamento para evitar bloqueio.`;
    }
    // O messageId deve ser um ID de mensagem já cadastrado no painel Appwrite Messaging
    // Para testes, pode-se usar um ID fixo ou criar um template
    const MESSAGE_ID = process.env.PUSH_MESSAGE_ID || '[MESSAGE_ID]';
    // Envia para o usuário específico
    const result = await messaging.createPush(
      MESSAGE_ID,
      title,
      body,
      [], // topics
      [userId], // users
      [], // targets
      { mensalidadeId, status, dataVencimento }, // data extra
      '', // action
      '', // icon
      '', // sound
      '', // color
      '', // tag
      1, // badge
      false, // contentAvailable
      false, // critical
      'normal', // priority
      false, // draft
      '' // scheduledAt
    );
    log(`Push enviado para user ${userId}: ${body}`);
    return result;
  } catch (err) {
    error(`Erro ao enviar push para user ${userId}:`, err.message);
    return null;
  }
}

export default async ({ req, res, log, error }) => {
  // Inicializa o client Appwrite
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || '')
    .setProject(process.env.APPWRITE_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || req.headers['x-appwrite-key'] || '');

  const db = new Databases(client);
  const DATABASE_ID = process.env.PAYMENT_DATABASE_ID || 'treinup';
  const MENSALIDADES_COLLECTION = process.env.MENSALIDADES_COLLECTION_ID || 'mensalidades';

  try {
    log('Iniciando checagem de mensalidades pendentes ou atrasadas...');
    const now = new Date();
    // Busca mensalidades pendentes ou atrasadas
    const result = await db.listDocuments(DATABASE_ID, MENSALIDADES_COLLECTION, [
      Query.or([Query.equal('status', 'PENDENTE'), Query.equal('status', 'ATRASADO')]),
      Query.greaterThan('dataVencimento', new Date(now.getFullYear() - 2, 0, 1).toISOString()), // Limita busca a 2 anos
      Query.limit(1000),
    ]);

    const notificacoes = [];
    for (const mensalidade of result.documents) {
      const diasParaVencimento = daysBetween(mensalidade.dataVencimento, now);
      // Notificar 7, 3, 1 dias antes e se já venceu
      if ([7, 3, 1].includes(diasParaVencimento) || diasParaVencimento <= 0) {
        notificacoes.push({
          alunoId: mensalidade.alunoId,
          mensalidadeId: mensalidade.$id,
          diasParaVencimento,
          status: mensalidade.status,
        });
        await sendPushNotification({
          client,
          userId: mensalidade.alunoId,
          diasParaVencimento,
          mensalidadeId: mensalidade.$id,
          status: mensalidade.status,
          dataVencimento: mensalidade.dataVencimento,
          log,
          error,
        });
      }
    }

    return res.json({ ok: true, notificacoes, total: notificacoes.length });
  } catch (err) {
    error('Erro na função de checagem de pendências:', err);
    return res.json({ ok: false, message: err.message || 'Erro ao checar pendências' });
  }
};
