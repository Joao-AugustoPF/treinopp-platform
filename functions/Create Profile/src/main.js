import { Client, Databases, ID, Permission, Role } from 'node-appwrite';

export default async ({ req, res, log }) => {
  // Inicializa o client Appwrite com as variáveis de ambiente
  const client = new Client()
    .setEndpoint('https://api.treinopp.com/v1' || '')
    .setProject('treinup' || '')
    .setKey(req.headers['x-appwrite-key'] || '');

  const db = new Databases(client);
  const DATABASE_ID = 'treinup';
  const COLLECTION_ID = '682161970028be4664f2';
  const DEFAULT_TEAM = '6821988e0022060185a9';

  try {
    // body esperado: { userId: string, name: string, email: string }
    const { userId, name, email, role } = JSON.parse(req.body || '{}');

    if (!userId || !name || !email || !role) {
      throw new Error('Payload inválido: userId, name, email e role são obrigatórios.');
    }

    // Valores padrão para o profile
    const profileData = {
      userId,
      name,
      email,
      role,
      tenantId: DEFAULT_TEAM,
      // Adiciona configurações padrão de preferências
      pref_notifications: true,
      pref_emailUpdates: true,
      pref_darkMode: true,
      pref_offlineMode: false,
      pref_hapticFeedback: true,
      pref_autoUpdate: true,
      pref_language: 'Português',
      // Adiciona configurações padrão de privacidade
      privacy_publicProfile: true,
      privacy_showWorkouts: false,
      privacy_showProgress: true,
      privacy_twoFactorAuth: false,
      // Adiciona estatísticas iniciais
      stats_workouts: 0,
      stats_classes: 0,
      stats_achievements: 0,
    };

    // Cria o documento de profile na collection "profiles"
    const profile = await db.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), profileData, [
      // só membros da academia enxergam o profile
      Permission.read(Role.team(DEFAULT_TEAM)),
      // OWNER e TRAINER podem atualizar ou deletar, se necessário
      Permission.update(Role.team(DEFAULT_TEAM, 'OWNER')),
      Permission.update(Role.team(DEFAULT_TEAM, 'TRAINER')),
      Permission.delete(Role.team(DEFAULT_TEAM, 'OWNER')),
    ]);

    log(`Profile criado: ${profile.$id} para user ${userId}`);
    return res.json({ ok: true, profileId: profile.$id });
  } catch (err) {
    log('Erro em createProfile:', err);
    return res.json({
      ok: false,
      message: err.message || 'Erro ao criar profile',
    });
  }
};
