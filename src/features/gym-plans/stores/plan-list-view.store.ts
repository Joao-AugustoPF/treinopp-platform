import { create } from 'zustand';

import type { IPlan } from '../types/plan';

type PlanListViewStore = {
  currentPlan: IPlan | null;
  setCurrentPlan: (plan: IPlan | null) => void;
  planToDelete: IPlan | null;
  setPlanToDelete: (plan: IPlan | null) => void;
};

export const usePlanListViewStore = create<PlanListViewStore>((set) => ({
  currentPlan: null,
  setCurrentPlan: (plan) => set({ currentPlan: plan }),
  planToDelete: null,
  setPlanToDelete: (plan) => set({ planToDelete: plan }),
}));
