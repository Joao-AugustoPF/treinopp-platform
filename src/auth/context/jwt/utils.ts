import { Client, Account } from 'appwrite';

import { paths } from 'src/routes/paths';

// src/auth/utils.ts
import axios from 'src/lib/axios';

import { JWT_STORAGE_KEY } from './constant';

// ----------------------------------------------------------------------
// Helpers de JWT
// ----------------------------------------------------------------------
type DecodedJWT = { exp: number; [key: string]: any };

function decodeJWT(token: string): DecodedJWT | null {
  try {
    const [, payload] = token.split('.');
    const str = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(str);
  } catch {
    return null;
  }
}

function isExpired(exp: number): boolean {
  return exp * 1000 <= Date.now();
}

// ----------------------------------------------------------------------
// Appwrite Client & Account
// ----------------------------------------------------------------------
const appwriteClient = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const accountSDK = new Account(appwriteClient);

// ----------------------------------------------------------------------
// Gerenciamento de timer para refresh
// ----------------------------------------------------------------------
let refreshTimer: ReturnType<typeof setTimeout> | null = null;

function clearRefreshTimer() {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
}

async function tryRefreshToken() {
  try {
    const oldToken = sessionStorage.getItem(JWT_STORAGE_KEY)!;
    appwriteClient.setJWT(oldToken);
    const { jwt } = await accountSDK.createJWT();
    setSession(jwt);
  } catch {
    handleExpiry();
  }
}

/**
 * Agenda um refresh do JWT 1 minuto antes de expirar.
 * Sempre retorna void.
 */
function scheduleRefresh(exp: number, marginMs = 60_000): void {
  clearRefreshTimer();

  const msUntil = exp * 1000 - Date.now() - marginMs;

  if (msUntil <= 0) {
    // Se já passou do tempo de refresh, tenta imediatamente
    tryRefreshToken();
  } else {
    // Agenda o refresh para daqui a msUntil
    refreshTimer = setTimeout(tryRefreshToken, msUntil);
  }

  // Não retorna nada
}

async function handleExpiry() {
  clearRefreshTimer();

  try {
    await accountSDK.deleteSession('current'); // ✅ Remove a sessão do Appwrite
  } catch (err) {
    console.warn('Erro ao tentar encerrar a sessão Appwrite:', err);
  }

  sessionStorage.removeItem(JWT_STORAGE_KEY);
  delete axios.defaults.headers.common.Authorization;
  window.location.href = paths.auth.jwt.signIn;
}

// ----------------------------------------------------------------------
// API pública
// ----------------------------------------------------------------------

/**
 * Seta ou remove o JWT, configura axios e agenda o refresh.
 */
export function setSession(token: string | null) {
  clearRefreshTimer();

  if (!token) {
    sessionStorage.removeItem(JWT_STORAGE_KEY);
    delete axios.defaults.headers.common.Authorization;
    return;
  }

  sessionStorage.setItem(JWT_STORAGE_KEY, token);
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;

  const decoded = decodeJWT(token);
  if (!decoded?.exp) {
    console.warn('JWT sem exp válido — não agendando refresh');
    return;
  }

  if (isExpired(decoded.exp)) {
    handleExpiry();
  } else {
    // Agenda o próximo refresh
    scheduleRefresh(decoded.exp);
  }
}

/**
 * Retorna true se o token ainda for válido.
 */
export function isValidToken(token: string | null): boolean {
  if (!token) return false;
  const decoded = decodeJWT(token);
  return decoded?.exp ? !isExpired(decoded.exp) : false;
}
