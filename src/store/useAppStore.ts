
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
  isModelThinking: boolean; // Added new state variable
  connectionStatus: ConnectionStatus;

  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  setIsBotTyping: (isTyping: boolean) => void;
  setIsModelThinking: (isThinking: boolean) => void; // Setter for the new state variable
  addStreamedBotChunk: (content: string) => void;
  addBotFunctionCallOrResponse: (type: 'function_call' | 'function_response', data: any) => void;
  finalizeBotMessage: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  chatMessages: [
    { id: 'initial-bot', sender: 'bot', content: 'Hello! How can I help you?', timestamp: new Date(), type: 'text' },
  ],
  isBotTyping: false,
  isModelThinking: false, // Initialize new state variable
  connectionStatus: 'disconnected',

  addChatMessage: (message) => {
    set((state) => ({
      chatMessages: [...state.chatMessages, { ...message, id: uuidv4(), timestamp: new Date() }],
    }));
  },

  setConnectionStatus: (status) => set({ connectionStatus: status }),
  setIsBotTyping: (isTyping) => set({ isBotTyping: isTyping }),
  setIsModelThinking: (isThinking) => set({ isModelThinking: isThinking }), // Implementation of the setter

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
