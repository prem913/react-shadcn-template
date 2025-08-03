
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

// Assuming fetchApplications is defined elsewhere, e.g., in mockApi.ts
// For this example, we'll mock it.
const fetchApplications = async (): Promise<Application[]> => {
  return [
    { id: 'echo_agent', name: 'Echo Agent', icon: '🤖' },
    { id: 'another_agent', name: 'Another Agent', icon: '🧠' },
  ];
};


export interface Application {
  id: string;
  name: string;
  icon: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  content: string;
  timestamp: Date;
  type: 'text' | 'function_call' | 'function_response';
  data?: any;
}

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

interface AppState {
  applications: Application[];
  chatMessages: ChatMessage[];
  isLoadingApplications: boolean;
  isBotTyping: boolean;
  selectedApplication: Application | null;
  connectionStatus: ConnectionStatus;

  fetchApplications: () => Promise<void>;
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setSelectedApplication: (app: Application | null) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  setIsBotTyping: (isTyping: boolean) => void;
  appendBotMessage: (chunk: string, type?: 'text' | 'function_call' | 'function_response', data?: any) => void;
  finalizeBotMessage: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  applications: [],
  chatMessages: [
    { id: 'initial-bot', sender: 'bot', content: 'Hello! Please select an application to start a conversation.', timestamp: new Date(), type: 'text' },
  ],
  isLoadingApplications: false,
  isBotTyping: false,
  selectedApplication: null,
  connectionStatus: 'disconnected',

  fetchApplications: async () => {
    set({ isLoadingApplications: true });
    try {
      const apps = await fetchApplications();
      set({ applications: apps, isLoadingApplications: false });
      if (apps.length > 0) {
        set({ selectedApplication: apps[0] });
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error);
      set({ isLoadingApplications: false });
    }
  },

  addChatMessage: (message) => {
    set((state) => ({
      chatMessages: [...state.chatMessages, { ...message, id: uuidv4(), timestamp: new Date() }],
    }));
  },

  setSelectedApplication: (app) => {
    set({
      selectedApplication: app,
      // Reset chat when a new application is selected
      chatMessages: [{
        id: uuidv4(),
        sender: 'bot',
        content: `You've selected ${app?.name || 'a new agent'}. How can I help you?`,
        timestamp: new Date(),
        type: 'text'
      }]
    });
  },

  setConnectionStatus: (status) => set({ connectionStatus: status }),
  setIsBotTyping: (isTyping) => set({ isBotTyping: isTyping }),

  appendBotMessage: (chunk, type = 'text', data = undefined) => {
    set((state) => {
      const lastMessage = state.chatMessages[state.chatMessages.length - 1];
      // If the last message was from the bot and we are in a "typing" state, append to it
      if (lastMessage && lastMessage.sender === 'bot' && state.isBotTyping && lastMessage.type === type) {
        const updatedMessages = [...state.chatMessages];
        updatedMessages[updatedMessages.length - 1] = {
          ...lastMessage,
          content: lastMessage.content + chunk,
          data: data || lastMessage.data // Update data if provided
        };
        return { chatMessages: updatedMessages };
      } else {
        // Otherwise, create a new bot message
        const newBotMessage: ChatMessage = {
          id: uuidv4(),
          sender: 'bot',
          content: chunk,
          timestamp: new Date(),
          type: type,
          data: data,
        };
        return {
          chatMessages: [...state.chatMessages, newBotMessage],
          isBotTyping: true, // Start "typing"
        };
      }
    });
  },

  finalizeBotMessage: () => {
    set({ isBotTyping: false });
  },
}));

