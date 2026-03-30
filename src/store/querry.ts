import type { QuerryStore } from '@/type/querry';

import { create } from 'zustand';

// DuckD

// Fixed Zustand store
export const useQuerryStore = create<QuerryStore>((set) => ({
  // Initial state
  executedQuerry: '',
  historyQuerry: [],
  currentQuerry: '',
  errorQuerry: '',
  setErrorQuerry: (errorQuerry: string) => set({ errorQuerry: errorQuerry }),

  setExecutedQuerry: (executedQuerry: string) => set({ executedQuerry: executedQuerry }),

  setCurrentQuerry: (currentQuerry: string) => set({ currentQuerry: currentQuerry }),

  setHistoryQuerry: (historyQuerry: string[]) => set({ historyQuerry: historyQuerry })
}));

export default useQuerryStore;
