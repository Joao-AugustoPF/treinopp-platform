import type { NavSectionProps } from 'src/components/nav-section';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';

import { SvgColor } from 'src/components/svg-color';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { user } = useAuthContext();

  const profile = user?.profile;

  const isSupport = () => profile?.role === 'SUPPORT';
  const isTrainer = () => profile?.role === 'TRAINER';
  const isOwner = () => profile?.role === 'OWNER';

  const showTrainerSections = isTrainer() || isOwner();

  const navData: NavSectionProps['data'] = [
    // --- Support ---
    ...(isSupport()
      ? [
          {
            subheader: 'Gerenciamento da Academia',
            items: [
              { title: 'Academias', path: paths.academia.list, icon: ICONS.folder },
              { title: 'Planos', path: paths.plans.list, icon: ICONS.invoice },
              { title: 'Alunos', path: paths.aluno.list, icon: ICONS.user },
              { title: 'Treinadores', path: paths.treinador.list, icon: ICONS.job },
            ],
          },
        ]
      : []),

    // --- Trainer / Owner vê tudo de trainer ---
    ...(showTrainerSections
      ? [
          {
            subheader: 'Meu Perfil',
            items: [
              {
                title: 'Meus Dados',
                path: paths.account.root,
                icon: ICONS.user,
              },
              {
                title: 'Minha Agenda',
                path: paths.treinador.agenda(profile?.$id || ''),
                icon: ICONS.calendar,
              },
            ],
          },
          {
            subheader: 'Gestão de Atividades',
            items: [
              { title: 'Aulas', path: paths.aula.list, icon: ICONS.course },
              // { title: 'Treinos', path: paths.treino.list, icon: ICONS.kanban },
            ],
          },
          {
            subheader: 'Gestão de Alunos',
            items: [
              {
                title: 'Meus Alunos',
                path: paths.aluno.list,
                icon: ICONS.user,
              },
              // {
              //   title: 'Treinos dos Alunos',
              //   path: paths.treinador.treinos(profile?.$id || ''),
              //   icon: ICONS.course,
              // },
              {
                title: 'Avaliações',
                path: paths.treinador.avaliacoes(profile?.$id || ''),
                icon: ICONS.analytics,
              },
            ],
          },
          {
            subheader: 'Gestão de Notificações',
            items: [{ title: 'Notificações', path: paths.notificacao.list, icon: ICONS.external }],
          },
        ]
      : []),

    // --- Apenas Owner vê as seções de gestão global ---
    ...(isOwner()
      ? [
          {
            subheader: 'Gestão de Equipe',
            items: [{ title: 'Treinadores', path: paths.treinador.list, icon: ICONS.job }],
          },
          {
            subheader: 'Gestão de Planos',
            items: [{ title: 'Planos', path: paths.planos.list, icon: ICONS.invoice }],
          },
        ]
      : []),
  ];

  return navData;
}
