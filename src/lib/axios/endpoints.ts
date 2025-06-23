export const endpoints = {
  aluno: {
    list: '/api/alunos',
    details: (id: string) => `/api/alunos/${id}`,
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
      create: '/api/mensalidades',
      update: (id: string) => `/api/mensalidades/${id}`,
      delete: (id: string) => `/api/mensalidades/${id}`,
      generate: '/api/mensalidades/generate',
    },
  },
  plans: {
    list: '/api/plans',
    create: '/api/plans',
    details: (id: string) => `/api/plans/${id}`,
    update: (id: string) => `/api/plans/${id}`,
    delete: (id: string) => `/api/plans/${id}`,
  },
  academia: {
    list: '/api/academias',
    create: '/api/academias',
    details: (id: string) => `/api/academias/${id}`,
    update: (id: string) => `/api/academias/${id}`,
    delete: (id: string) => `/api/academias/${id}`,
  },
  treinador: {
    list: '/api/treinadores',
    create: '/api/treinadores',
    details: (id: string) => `/api/treinadores/${id}`,
    update: (id: string) => `/api/treinadores/${id}`,
    delete: (id: string) => `/api/treinadores/${id}`,
  },
  user: {
    list: '/api/users',
    profile: '/api/profile',
    update: (id: string) => `/api/users/${id}`,
  },
  // ... outros endpoints
};
