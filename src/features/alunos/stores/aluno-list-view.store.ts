import { create } from 'zustand';

import type { IAluno } from '../types';

type AlunoListViewStore = {
  currentAluno: IAluno | null;
  setCurrentAluno: (aluno: IAluno | null) => void;
  alunoToDelete: IAluno | null;
  setAlunoToDelete: (aluno: IAluno | null) => void;
};

export const useAlunoListViewStore = create<AlunoListViewStore>((set) => ({
  currentAluno: null,
  setCurrentAluno: (aluno) => set({ currentAluno: aluno }),
  alunoToDelete: null,
  setAlunoToDelete: (aluno) => set({ alunoToDelete: aluno }),
}));
