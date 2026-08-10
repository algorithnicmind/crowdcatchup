import { create } from 'zustand';
import { LanguageCode } from '../shared/lib/translations';

export type MobileTab = 'live' | 'nav' | 'sos';

interface UiStoreState {
  language: LanguageCode;
  isSitrepModalOpen: boolean;
  isVoiceAssistantActive: boolean;
  activeMobileTab: MobileTab;
  broadcastMessage: string | null;

  // Actions
  setLanguage: (lang: LanguageCode) => void;
  setSitrepModalOpen: (open: boolean) => void;
  setVoiceAssistantActive: (active: boolean) => void;
  setActiveMobileTab: (tab: MobileTab) => void;
  setBroadcastMessage: (msg: string | null) => void;
}

export const useUiStore = create<UiStoreState>((set) => ({
  language: 'en',
  isSitrepModalOpen: false,
  isVoiceAssistantActive: false,
  activeMobileTab: 'live',
  broadcastMessage: null,

  setLanguage: (lang) => set({ language: lang }),
  setSitrepModalOpen: (open) => set({ isSitrepModalOpen: open }),
  setVoiceAssistantActive: (active) => set({ isVoiceAssistantActive: active }),
  setActiveMobileTab: (tab) => set({ activeMobileTab: tab }),
  setBroadcastMessage: (msg) => set({ broadcastMessage: msg }),
}));
