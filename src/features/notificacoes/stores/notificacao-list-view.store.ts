import { create } from 'zustand';

import type { INotificacao } from '../types/notificacao';

type NotificacaoListViewStore = {
  currentNotificacao: INotificacao | null;
  setCurrentNotificacao: (notificacao: INotificacao | null) => void;
  notificacaoToDelete: INotificacao | null;
  setNotificacaoToDelete: (notificacao: INotificacao | null) => void;
};

export const useNotificacaoListViewStore = create<NotificacaoListViewStore>((set) => ({
  currentNotificacao: null,
  setCurrentNotificacao: (notificacao) => set({ currentNotificacao: notificacao }),
  notificacaoToDelete: null,
  setNotificacaoToDelete: (notificacao) => set({ notificacaoToDelete: notificacao }),
}));
