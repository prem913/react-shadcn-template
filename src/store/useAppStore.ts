
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
  content: string; // Changed from 'data' to 'content'
  timestamp: Date;
  type: 'text' | 'function_call' | 'function_response';
  data?: any; // Kept for function_call/response types
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
  addStreamedBotChunk: (content: string) => void;
  addBotFunctionCallOrResponse: (type: 'function_call' | 'function_response', data: any) => void;
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

  addStreamedBotChunk: (content) => {
    set((state) => {
      const lastMessage = state.chatMessages[state.chatMessages.length - 1];
      if (state.isBotTyping && lastMessage && lastMessage.sender === 'bot' && lastMessage.type === 'text') {
        // Append to the last bot message if it's a text stream
        return {
          chatMessages: state.chatMessages.map((msg, index) =>
            index === state.chatMessages.length - 1
              ? { ...msg, content: msg.content + content }
              : msg
          ),
        };
      } else {
        // Create a new bot message
        return {
          chatMessages: [
            ...state.chatMessages,
            {
              id: uuidv4(),
              sender: 'bot',
              content: content,
              timestamp: new Date(),
              type: 'text',
            },
          ],
          isBotTyping: true, // Start typing indicator for new message
        };
      }
    });
  },

  addBotFunctionCallOrResponse: (type, data) => {
    set((state) => ({
      chatMessages: [
        ...state.chatMessages,
        {
          id: uuidv4(),
          sender: 'bot',
          content: '', // Content can be empty for function call/response as data holds the info
          timestamp: new Date(),
          type: type,
          data: data,
        },
      ],
      isBotTyping: true, // Bot is "typing" while processing function call/response
    }));
  },

  finalizeBotMessage: () => {
    set({ isBotTyping: false });
  },
}));
