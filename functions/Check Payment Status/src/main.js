import { Client, Databases, Query } from 'node-appwrite';
import { Expo } from 'expo-server-sdk';

// Initialize Expo SDK
const expo = new Expo();

function daysBetween(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return Math.ceil((d1 - d2) / (1000 * 60 * 60 * 24));
}

async function getUserPushToken(db, userId, log, error) {
  try {
    // Buscar o perfil do usuário para obter o push token
    const userProfile = await db.getDocument(
      process.env.PAYMENT_DATABASE_ID || 'treinup',
      process.env.PROFILES_COLLECTION_ID || '682161970028be4664f2', // Profiles collection
      userId
    );

    // Verificar se o usuário tem push token e se as notificações estão habilitadas
    if (!userProfile.pushToken) {
      log(`Usuário ${userId} não possui push token registrado`);
      return null;
    }

    if (userProfile.pref_notifications === false) {
      log(`Usuário ${userId} desabilitou notificações`);
      return null;
    }

    return userProfile.pushToken;
  } catch (err) {
    error(`Erro ao buscar push token do usuário ${userId}:`, err.message);
    return null;
  }
}

async function sendPushNotification({
  db,
  userId,
  diasParaVencimento,
  mensalidadeId,
  status,
  dataVencimento,
  log,
  error,
}) {
  try {
    // Buscar o push token do usuário no banco de dados
    const pushToken = await getUserPushToken(db, userId, log, error);

    if (!pushToken) {
      log(
        `Não foi possível enviar push para usuário ${userId} - sem token ou notificações desabilitadas`
      );
      return null;
    }

    // Check if the push token is valid
    if (!Expo.isExpoPushToken(pushToken)) {
      error(`Invalid Expo push token for user ${userId}: ${pushToken}`);
      return null;
    }

    // Create the notification message
    let title = 'Aviso de Mensalidade';
    let body = '';

    if (diasParaVencimento > 0) {
      body = `Sua mensalidade vence em ${diasParaVencimento} dia(s): ${new Date(dataVencimento).toLocaleDateString('pt-BR')}`;
    } else if (diasParaVencimento === 0) {
      body = `Sua mensalidade vence hoje!`;
    } else {
      body = `Sua mensalidade está vencida! Regularize o pagamento para evitar bloqueio.`;
    }

    // Create the push notification message
    const message = {
      to: pushToken,
      sound: 'default',
      title: title,
      body: body,
      data: {
        mensalidadeId,
        status,
        dataVencimento,
        userId,
      },
      priority: 'high', // Use high priority for payment notifications
      channelId: 'payment-notifications', // Android notification channel
    };

    // Send the notification
    const chunks = expo.chunkPushNotifications([message]);
    const tickets = [];

    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (err) {
        error(`Error sending chunk to Expo: ${err.message}`);
      }
    }

    // Check for errors in tickets
    const errors = [];
    tickets.forEach((ticket, index) => {
      if (ticket.status === 'error') {
        errors.push({
          index,
          message: ticket.message,
          details: ticket.details,
        });
      }
    });

    if (errors.length > 0) {
      error(`Errors sending push notifications for user ${userId}:`, errors);
    } else {
      log(`Push notification sent successfully for user ${userId}: ${body}`);
    }

    // Return tickets for receipt checking (optional)
    return tickets;
  } catch (err) {
    error(`Error sending push notification for user ${userId}:`, err.message);
    return null;
  }
}

async function checkPushReceipts(tickets, log, error) {
  // Check push receipts after 15 minutes (as recommended by Expo)
  // This is optional but recommended for production
  const receiptIds = tickets.filter((ticket) => ticket.status === 'ok').map((ticket) => ticket.id);

  if (receiptIds.length === 0) {
    return;
  }

  try {
    const receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
    const receipts = [];

    for (const chunk of receiptIdChunks) {
      try {
        const receiptChunk = await expo.getPushNotificationReceiptsAsync(chunk);
        receipts.push(...receiptChunk);
      } catch (err) {
        error(`Error getting receipts: ${err.message}`);
      }
    }

    // Check for delivery errors
    receipts.forEach((receipt, index) => {
      if (receipt.status === 'error') {
        error(`Push notification delivery failed:`, {
          receiptId: receiptIds[index],
          error: receipt.message,
          details: receipt.details,
        });
      }
    });
  } catch (err) {
    error(`Error checking push receipts: ${err.message}`);
  }
}

export default async ({ req, res, log, error }) => {
  // Initialize Appwrite client
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
    const allTickets = [];

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

        const tickets = await sendPushNotification({
          db,
          userId: mensalidade.alunoId,
          diasParaVencimento,
          mensalidadeId: mensalidade.$id,
          status: mensalidade.status,
          dataVencimento: mensalidade.dataVencimento,
          log,
          error,
        });

        if (tickets) {
          allTickets.push(...tickets);
        }
      }
    }

    // Optional: Check push receipts after a delay
    // In production, you might want to implement this as a separate function
    // or use a job queue to check receipts after 15 minutes
    if (allTickets.length > 0) {
      log(
        `Sent ${allTickets.length} push notifications. Consider checking receipts after 15 minutes.`
      );
    }

    return res.json({
      ok: true,
      notificacoes,
      total: notificacoes.length,
      pushNotificationsSent: allTickets.length,
    });
  } catch (err) {
    error('Erro na função de checagem de pendências:', err);
    return res.json({ ok: false, message: err.message || 'Erro ao checar pendências' });
  }
};
