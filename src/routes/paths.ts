import { kebabCase } from 'es-toolkit';

import { _id, _postTitles } from 'src/_mock/assets';

// ----------------------------------------------------------------------

const MOCK_ID = _id[1];

const MOCK_TITLE = _postTitles[2];

const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  DASHBOARD: '/',
};

// ----------------------------------------------------------------------

export const paths = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/error/403',
  page404: '/error/404',
  page500: '/error/500',
  components: '/components',
  docs: 'https://docs.minimals.cc',
  changelog: 'https://docs.minimals.cc/changelog',
  zoneStore: 'https://mui.com/store/items/zone-landing-page/',
  minimalStore: 'https://mui.com/store/items/minimal-dashboard/',
  freeUI: 'https://mui.com/store/items/minimal-dashboard-free/',
  figmaUrl: 'https://www.figma.com/design/cAPz4pYPtQEXivqe11EcDE/%5BPreview%5D-Minimal-Web.v6.0.0',

  // GYM MANAGEMENT
  academia: {
    root: '/academia',
    list: '/academia/list',
    new: '/academia/new',
    details: (id: string) => `/academia/${id}`,
    edit: (id: string) => `/academia/${id}/edit`,
  },

  avaliacoes: {
    root: '/avaliacoes',
    list: '/avaliacoes/list',
    new: '/avaliacoes/new',
    details: (id: string) => `/avaliacoes/${id}`,
    edit: (id: string) => `/avaliacoes/${id}/edit`,
  },

  progresso: {
    root: '/progresso',
    list: '/progresso/list',
    new: '/progresso/new',
    details: (id: string) => `/progresso/${id}`,
    edit: (id: string) => `/progresso/${id}/edit`,
  },

  unidade: {
    root: '/unidade',
    list: '/unidade/list',
    new: '/unidade/new',
    details: (id: string) => `/unidade/${id}`,
    edit: (id: string) => `/unidade/${id}/edit`,
  },

  // MEMBERS MANAGEMENT
  aluno: {
    root: '/aluno',
    list: '/aluno/list',
    new: '/aluno/new',
    details: (id: string) => `/aluno/${id}`,
    edit: (id: string) => `/aluno/${id}/edit`,
  },

  planos: {
    root: '/plans',
    list: '/plans/list',
    new: '/plans/new',
    details: (id: string) => `/plans/${id}`,
    edit: (id: string) => `/plans/${id}/edit`,
  },

  detento: {
    root: '/detento',
    list: '/detento/list',
    new: '/detento/new',
    details: (id: string) => `/detento/${id}`,
    edit: (id: string) => `/detento/${id}/edit`,
    agenda: (id: string) => `/detento/${id}/agenda`,
  },

  // STAFF MANAGEMENT
  treinador: {
    root: '/treinador',
    list: '/treinador/list',
    new: '/treinador/new',
    details: (id: string) => `/treinador/${id}`,
    edit: (id: string) => `/treinador/${id}/edit`,
    agenda: (id: string) => `/treinador/${id}/agenda`,
    compromisso: (id: string) => `/treinador/${id}/agenda`,
    alunos: (id: string) => `/treinador/${id}/alunos`,
    aluno: (id: string) => `/treinador/${id}/alunos/${id}`,
    treinos: (id: string) => `/treinador/${id}/alunos/${id}/treinos`,
    treino: (id: string, treinoId: string) => `/treinador/${id}/alunos/${id}/treinos/${treinoId}`,
    avaliacoes: (id: string) => `/treinador/${id}/avaliacoes/`,
    avaliacao: (id: string, avaliacaoId: string) =>
      `/treinador/${id}/avaliacoes/${avaliacaoId}/edit`,
  },

  account: {
    root: '/account',
    details: (id: string) => `/account/${id}`,
  },

  // CLASSES AND TRAINING
  aula: {
    root: '/aula',
    list: '/aula/list',
    new: '/aula/new',
    details: (id: string) => `/aula/${id}`,
    edit: (id: string) => `/aula/${id}/edit`,
  },

  notificacoes: {
    root: '/notificacoes',
    list: '/notificacoes/list',
    new: '/notificacoes/new',
  },

  notificacao: {
    root: '/notificacao',
    list: '/notificacao/list',
    new: '/notificacao/new',
    details: (id: string) => `/notificacao/${id}`,
    edit: (id: string) => `/notificacao/${id}/edit`,
  },

  treino: {
    root: '/treino',
    list: '/treino/list',
    new: '/treino/new',
    details: (id: string) => `/treino/${id}`,
    edit: (id: string) => `/treino/${id}/edit`,
  },

  // PLANS AND SUBSCRIPTIONS
  plans: {
    root: '/plans',
    list: '/plans/list',
    new: '/plans/new',
  },

  product: {
    root: `/product`,
    checkout: `/product/checkout`,
    details: (id: string) => `/product/${id}`,
    demo: { details: `/product/${MOCK_ID}` },
  },
  post: {
    root: `/post`,
    details: (title: string) => `/post/${kebabCase(title)}`,
    demo: { details: `/post/${kebabCase(MOCK_TITLE)}` },
  },
  // AUTH
  auth: {
    amplify: {
      signIn: `${ROOTS.AUTH}/amplify/sign-in`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      signUp: `${ROOTS.AUTH}/amplify/sign-up`,
      updatePassword: `${ROOTS.AUTH}/amplify/update-password`,
      resetPassword: `${ROOTS.AUTH}/amplify/reset-password`,
    },
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
      signUp: `${ROOTS.AUTH}/jwt/sign-up`,
      resetPassword: `${ROOTS.AUTH}/jwt/reset-password`,
      updatePassword: `${ROOTS.AUTH}/jwt/update-password`,
      verify: `${ROOTS.AUTH}/jwt/verify`,
    },
    firebase: {
      signIn: `${ROOTS.AUTH}/firebase/sign-in`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      signUp: `${ROOTS.AUTH}/firebase/sign-up`,
      resetPassword: `${ROOTS.AUTH}/firebase/reset-password`,
    },
    auth0: { signIn: `${ROOTS.AUTH}/auth0/sign-in` },
    supabase: {
      signIn: `${ROOTS.AUTH}/supabase/sign-in`,
      verify: `${ROOTS.AUTH}/supabase/verify`,
      signUp: `${ROOTS.AUTH}/supabase/sign-up`,
      updatePassword: `${ROOTS.AUTH}/supabase/update-password`,
      resetPassword: `${ROOTS.AUTH}/supabase/reset-password`,
    },
  },
  authDemo: {
    split: {
      signIn: `${ROOTS.AUTH_DEMO}/split/sign-in`,
      signUp: `${ROOTS.AUTH_DEMO}/split/sign-up`,
      resetPassword: `${ROOTS.AUTH_DEMO}/split/reset-password`,
      updatePassword: `${ROOTS.AUTH_DEMO}/split/update-password`,
      verify: `${ROOTS.AUTH_DEMO}/split/verify`,
    },
    centered: {
      signIn: `${ROOTS.AUTH_DEMO}/centered/sign-in`,
      signUp: `${ROOTS.AUTH_DEMO}/centered/sign-up`,
      resetPassword: `${ROOTS.AUTH_DEMO}/centered/reset-password`,
      updatePassword: `${ROOTS.AUTH_DEMO}/centered/update-password`,
      verify: `${ROOTS.AUTH_DEMO}/centered/verify`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    mail: `${ROOTS.DASHBOARD}/mail`,
    chat: `${ROOTS.DASHBOARD}/chat`,
    blank: `${ROOTS.DASHBOARD}/blank`,
    kanban: `${ROOTS.DASHBOARD}/kanban`,
    calendar: `${ROOTS.DASHBOARD}/calendar`,
    fileManager: `${ROOTS.DASHBOARD}/file-manager`,
    permission: `${ROOTS.DASHBOARD}/permission`,
    general: {
      app: `${ROOTS.DASHBOARD}/app`,
      ecommerce: `${ROOTS.DASHBOARD}/ecommerce`,
      analytics: `${ROOTS.DASHBOARD}/analytics`,
      banking: `${ROOTS.DASHBOARD}/banking`,
      booking: `${ROOTS.DASHBOARD}/booking`,
      file: `${ROOTS.DASHBOARD}/file`,
      course: `${ROOTS.DASHBOARD}/course`,
    },
    user: {
      root: `${ROOTS.DASHBOARD}/user`,
      new: `${ROOTS.DASHBOARD}/user/new`,
      list: `${ROOTS.DASHBOARD}/user/list`,
      cards: `${ROOTS.DASHBOARD}/user/cards`,
      profile: `${ROOTS.DASHBOARD}/user/profile`,
      account: `${ROOTS.DASHBOARD}/user/account`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
      demo: { edit: `${ROOTS.DASHBOARD}/user/${MOCK_ID}/edit` },
    },
    product: {
      root: `${ROOTS.DASHBOARD}/product`,
      new: `${ROOTS.DASHBOARD}/product/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/product/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/product/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/product/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/product/${MOCK_ID}/edit`,
      },
    },
    invoice: {
      root: `${ROOTS.DASHBOARD}/invoice`,
      new: `${ROOTS.DASHBOARD}/invoice/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/invoice/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/invoice/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}/edit`,
      },
    },
    post: {
      root: `${ROOTS.DASHBOARD}/post`,
      new: `${ROOTS.DASHBOARD}/post/new`,
      details: (title: string) => `${ROOTS.DASHBOARD}/post/${kebabCase(title)}`,
      edit: (title: string) => `${ROOTS.DASHBOARD}/post/${kebabCase(title)}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/post/${kebabCase(MOCK_TITLE)}`,
        edit: `${ROOTS.DASHBOARD}/post/${kebabCase(MOCK_TITLE)}/edit`,
      },
    },
    order: {
      root: `${ROOTS.DASHBOARD}/order`,
      details: (id: string) => `${ROOTS.DASHBOARD}/order/${id}`,
      demo: { details: `${ROOTS.DASHBOARD}/order/${MOCK_ID}` },
    },
    job: {
      root: `${ROOTS.DASHBOARD}/job`,
      new: `${ROOTS.DASHBOARD}/job/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/job/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/job/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/job/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/job/${MOCK_ID}/edit`,
      },
    },
    tour: {
      root: `${ROOTS.DASHBOARD}/tour`,
      new: `${ROOTS.DASHBOARD}/tour/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/tour/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/tour/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/tour/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/tour/${MOCK_ID}/edit`,
      },
    },
  },
};
