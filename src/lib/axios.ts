import type { AxiosRequestConfig } from 'axios';

import axios from 'axios';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: CONFIG.serverUrl });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong!')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  profiles: {
    list: '/api/roles',
    update: (id: string) => `/api/roles/${id}`,
    delete: (id: string) => `/api/roles/${id}`,
    details: (id: string) => `/api/roles/${id}`,
  },
  accounts: {
    list: '/api/accounts',
    update: (id: string) => `/api/accounts/${id}`,
    delete: (id: string) => `/api/accounts/${id}`,
    details: (id: string) => `/api/accounts/${id}`,
  },
  upload: {
    avatar: '/api/upload/avatar',
  },
  plans: {
    list: '/api/plans',
    create: '/api/plans',
    update: (id: string) => `/api/plans/${id}`,
    delete: (id: string) => `/api/plans/${id}`,
    details: (id: string) => `/api/plans/${id}`,
  },
  users: {
    list: '/api/users',
    update: (id: string) => `/api/users/${id}`,
    delete: (id: string) => `/api/users/${id}`,
  },
  detento: {
    list: '/api/detentos',
    update: (id: string) => `/api/detentos/${id}`,
    delete: (id: string) => `/api/detentos/${id}`,
    details: (id: string) => `/api/detentos/${id}`,
    agenda: (id: string) => `/api/detentos/${id}/agenda`,
  },
  unidade: {
    list: '/api/unidades',
    update: (id: string) => `/api/unidades/${id}`,
    delete: (id: string) => `/api/unidades/${id}`,
    details: (id: string) => `/api/unidades/${id}`,
  },
  academia: {
    list: '/api/academias',
    me: '/api/academias/me',
    update: (id: string) => `/api/academias/${id}`,
    delete: (id: string) => `/api/academias/${id}`,
    details: (id: string) => `/api/academias/${id}`,
  },
  aula: {
    list: '/api/aulas',
    create: '/api/aulas',
    update: (id: string) => `/api/aulas/${id}`,
    delete: (id: string) => `/api/aulas/${id}`,
    details: (id: string) => `/api/aulas/${id}`,
  },
  aluno: {
    list: '/api/alunos',
    update: (id: string) => `/api/alunos/${id}`,
    plan: {
      update: (id: string) => `/api/alunos/${id}/plan`,
    },
    payment: {
      list: (id: string) => `/api/alunos/${id}/payments`,
      add: (id: string) => `/api/alunos/${id}/payments`,
      update: (id: string, paymentId: string) => `/api/alunos/${id}/payments/${paymentId}`,
      delete: (id: string, paymentId: string) => `/api/alunos/${id}/payments/${paymentId}`,
    },
    mensalidades: {
      list: (id: string) => `/api/alunos/${id}/mensalidades`,
      create: (id: string) => `/api/alunos/${id}/mensalidades`,
      update: (id: string, mensalidadeId: string) => `/api/mensalidades/${mensalidadeId}`,
      delete: (id: string, mensalidadeId: string) => `/api/mensalidades/${mensalidadeId}`,
      generate: '/api/mensalidades/generate',
    },
    delete: (id: string) => `/api/alunos/${id}`,
    details: (id: string) => `/api/alunos/${id}`,
  },
  treinador: {
    list: '/api/treinadores',
    create: '/api/treinadores',
    update: (id: string) => `/api/treinadores/${id}`,
    delete: (id: string) => `/api/treinadores/${id}`,
    details: (id: string) => `/api/treinadores/${id}`,
    checkEmail: '/api/treinadores/check-email',
    avaliacoesSlots: (id: string) => `/api/treinadores/${id}/avaliacoes/slots`,
    disponibilidade: (id: string) => `/api/treinadores/${id}/disponibilidade`,
    agenda: (id: string) => `/api/treinadores/${id}/agenda`,
    avaliacoes: {
      list: (id: string) => `/api/treinadores/${id}/avaliacoes`,
      create: (id: string) => `/api/treinadores/${id}/avaliacoes`,
      update: (id: string, avaliacaoId: string) =>
        `/api/treinadores/${id}/avaliacoes/${avaliacaoId}`,
      delete: (id: string, avaliacaoId: string) =>
        `/api/treinadores/${id}/avaliacoes/${avaliacaoId}`,
      details: (id: string, avaliacaoId: string) =>
        `/api/treinadores/${id}/avaliacoes/${avaliacaoId}`,
    },
    notificacoes: {
      list: '/api/notificacoes',
      create: '/api/notificacoes',
      update: (id: string) => `/api/notificacoes/${id}`,
      delete: (id: string) => `/api/notificacoes/${id}`,
      details: (id: string) => `/api/notificacoes/${id}`,
    },
    treinamento: {
      list: '/api/treinamentos',
      details: (id: string) => `/api/treinamentos/${id}`,
      update: (id: string) => `/api/treinamentos/${id}`,
      delete: (id: string) => `/api/treinamentos/${id}`,
    },
  },
  treino: {
    list: '/api/treinos',
    create: '/api/treinos',
    update: (id: string) => `/api/treinos/${id}`,
    delete: (id: string) => `/api/treinos/${id}`,
    details: (id: string) => `/api/treinos/${id}`,
  },
  notificacao: {
    list: '/api/notificacoes',
    create: '/api/notificacoes',
    update: (id: string) => `/api/notificacoes/${id}`,
    delete: (id: string) => `/api/notificacoes/${id}`,
    details: (id: string) => `/api/notificacoes/${id}`,
  },
  policies: {
    list: '/api/policies',
  },
  auth: { me: '/api/auth/me', signIn: '/api/auth/sign-in', signUp: '/api/auth/sign-up' },
};
