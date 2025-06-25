import { Client, Teams } from 'node-appwrite';

// This Appwrite function will be executed every time it's triggered

export default async ({ req, res, log, error }) => {
  // Initialize Appwrite client with Function environment variables
  const client = new Client()
    .setEndpoint('https://api.treinopp.com/v1' || '')
    .setProject('treinup' || '')
    .setKey(req.headers['x-appwrite-key'] || '');

  const teams = new Teams(client);
  const DEFAULT_TEAM_ID = '6821988e0022060185a9';

  try {
    // Parse the incoming payload
    const { userId, teamId, role } = JSON.parse(req.body || '{}');

    if (!userId) {
      throw new Error('userId é obrigatório');
    }

    // Usar teamId fornecido ou fallback para DEFAULT_TEAM_ID
    const targetTeamId = teamId || DEFAULT_TEAM_ID;

    if (!targetTeamId) {
      throw new Error('teamId não fornecido e DEFAULT_TEAM_ID não configurado');
    }

    // Definir roles baseado no tipo de usuário
    let roles = ['member']; // role padrão

    if (role === 'TRAINER') {
      roles = ['member', 'TRAINER']; // Treinadores têm role específica
    } else if (role === 'OWNER') {
      roles = ['member', 'OWNER']; // Owners têm role específica
    }

    // Create membership directly by userId (server SDK)
    await teams.createMembership(
      targetTeamId,
      roles,
      undefined, // email
      userId // userId for direct association
    );

    log(`User ${userId} added to team ${targetTeamId} with roles: ${roles.join(', ')}`);
    return res.json({
      ok: true,
      teamId: targetTeamId,
      roles,
      message: `Usuário ${userId} adicionado ao team ${targetTeamId} com roles: ${roles.join(', ')}`,
    });
  } catch (err) {
    log('Error in joinDefaultTeam:', err);
    return res.json({
      ok: false,
      message: err.message || 'Erro ao vincular usuário ao time',
    });
  }
};
