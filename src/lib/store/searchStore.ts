import { create } from 'zustand';

interface SearchStore {
  isOpen: boolean;
  searchQuery: string;
  setIsOpen: (isOpen: boolean) => void;
  setSearchQuery: (query: string) => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  isOpen: false,
  searchQuery: '',
  setIsOpen: (isOpen) => set({ isOpen }),
  setSearchQuery: (query) => set({ searchQuery: query }),
})); 