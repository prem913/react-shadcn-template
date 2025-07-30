import { create } from 'zustand';
import { fetchApplications, sendChatMessage as mockSendChatMessage } from '../lib/mockApi';

interface Application {
  id: string;
  name: string;
  icon: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface AppState {
  applications: Application[];
  chatMessages: ChatMessage[];
  isLoadingApplications: boolean;
  isSendingMessage: boolean;
  selectedApplication: Application | null;
  fetchApplications: () => Promise<void>;
  addChatMessage: (message: ChatMessage) => void;
  sendChatMessage: (message: string) => Promise<void>;
  setIsLoadingApplications: (isLoading: boolean) => void;
  setIsSendingMessage: (isSending: boolean) => void;
  setSelectedApplication: (app: Application) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  applications: [],
  chatMessages: [
    { id: '1', sender: 'bot', content: 'Hello! How can I help you today?', timestamp: new Date() },
  ],
  isLoadingApplications: false,
  isSendingMessage: false,
  selectedApplication: null,

  fetchApplications: async () => {
    set({ isLoadingApplications: true });
    try {
      const apps = await fetchApplications();
      set({ applications: apps, isLoadingApplications: false });
      if (apps.length > 0) {
        set({ selectedApplication: apps[0] }); // Select the first application by default
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error);
      set({ isLoadingApplications: false });
    }
  },

  addChatMessage: (message) => {
    set((state) => ({
      chatMessages: [...state.chatMessages, message],
    }));
  },

  sendChatMessage: async (message) => {
    set({ isSendingMessage: true });
    get().addChatMessage({ id: Date.now().toString(), sender: 'user', content: message, timestamp: new Date() });

    try {
      const botResponse = await mockSendChatMessage(message);
      get().addChatMessage({ id: (Date.now() + 1).toString(), sender: 'bot', content: botResponse, timestamp: new Date() });
    } catch (error) {
      console.error('Failed to send message:', error);
      get().addChatMessage({ id: (Date.now() + 1).toString(), sender: 'bot', content: 'Error: Could not get a response.', timestamp: new Date() });
    } finally {
      set({ isSendingMessage: false });
    }
  },

  setIsLoadingApplications: (isLoading) => set({ isLoadingApplications: isLoading }),
  setIsSendingMessage: (isSending) => set({ isSendingMessage: isSending }),
  setSelectedApplication: (app) => set({ selectedApplication: app }),
}));
