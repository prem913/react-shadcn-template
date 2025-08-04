import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

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
  chatMessages: ChatMessage[];
  isBotTyping: boolean;
  isModelThinking: boolean;
  connectionStatus: ConnectionStatus;
  clientId: string | null; // Added clientId to AppState

  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  setIsBotTyping: (isTyping: boolean) => void;
  setIsModelThinking: (isThinking: boolean) => void;
  addStreamedBotChunk: (content: string) => void;
  addBotFunctionCallOrResponse: (type: 'function_call' | 'function_response', data: any) => void;
  finalizeBotMessage: () => void;
  setClientId: (clientId: string | null) => void; // Added setClientId to AppState
}

export const useAppStore = create<AppState>((set) => ({
  chatMessages: [
    { id: 'initial-bot', sender: 'bot', content: 'Hello! How can I help you?', timestamp: new Date(), type: 'text' },
  ],
  isBotTyping: false,
  isModelThinking: false,
  connectionStatus: 'disconnected',
  clientId: null, // Initialize clientId

  addChatMessage: (message) => {
    set((state) => ({
      chatMessages: [...state.chatMessages, { ...message, id: uuidv4(), timestamp: new Date() }],
    }));
  },

  setConnectionStatus: (status) => set({ connectionStatus: status }),
  setIsBotTyping: (isTyping) => set({ isBotTyping: isTyping }),
  setIsModelThinking: (isThinking) => set({ isModelThinking: isThinking }),
  setClientId: (clientId) => set({ clientId: clientId }), // Implementation of setClientId

  addStreamedBotChunk: (content) => {
    set((state) => {
      const lastMessage = state.chatMessages[state.chatMessages.length - 1];
      if (state.isBotTyping && lastMessage && lastMessage.sender === 'bot' && lastMessage.type === 'text') {
        return {
          chatMessages: state.chatMessages.map((msg, index) =>
            index === state.chatMessages.length - 1
              ? { ...msg, content: msg.content + content }
              : msg
          ),
        };
      } else {
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
          isBotTyping: true,
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
      isBotTyping: true,
    }));
  },

  finalizeBotMessage: () => {
    set({ isBotTyping: false });
  },
}));
