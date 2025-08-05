import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { getFileStructure, getFileContent, saveFile, deleteFile } from '../lib/api';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  content: string;
  timestamp: Date;
  type: 'text' | 'function_call' | 'function_response';
  data?: any;
}

export interface FileEntry {
  id: number;
  name: string;
  type: 'file' | 'directory';
  parent_id: number | null;
  relativePath?: string;
}

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

interface FileExplorerState {
  fileStructure: FileEntry[];
  selectedFile: FileEntry | null;
  fileContent: string;
  isFileExplorerLoading: boolean;
  fileExplorerError: string | null;
  isFileViewDialogOpen: boolean;
  isFileEditing: boolean;

  fetchFileStructure: () => Promise<void>;
  selectFile: (file: FileEntry) => Promise<void>;
  updateFileContent: (content: string) => void;
  saveEditedFile: () => Promise<void>;
  deleteSelectedFile: () => Promise<void>;
  setIsFileEditing: (isEditing: boolean) => void;
  setIsFileViewDialogOpen: (isOpen: boolean) => void;
  calculateRelativePaths: (structure: FileEntry[]) => FileEntry[]; // Expose for internal use
}


interface AppState {
  chatMessages: ChatMessage[];
  isBotTyping: boolean;
  isModelThinking: boolean;
  connectionStatus: ConnectionStatus;
  clientId: string | null;

  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  setIsBotTyping: (isTyping: boolean) => void;
  setIsModelThinking: (isThinking: boolean) => void;
  addStreamedBotChunk: (content: string) => void;
  addBotFunctionCallOrResponse: (type: 'function_call' | 'function_response', data: any) => void;
  finalizeBotMessage: () => void;
  setClientId: (clientId: string | null) => void;

  // NEW: File Explorer State and Actions
  fileExplorer: FileExplorerState;
}

export const useAppStore = create<AppState>((set, get) => ({
  chatMessages: [
    { id: 'initial-bot', sender: 'bot', content: 'Hello! How can I help you?', timestamp: new Date(), type: 'text' },
  ],
  isBotTyping: false,
  isModelThinking: false,
  connectionStatus: 'disconnected',
  clientId: null,

  addChatMessage: (message) => {
    set((state) => ({
      chatMessages: [...state.chatMessages, { ...message, id: uuidv4(), timestamp: new Date() }],
    }));
  },

  setConnectionStatus: (status) => set({ connectionStatus: status }),
  setIsBotTyping: (isTyping) => set({ isBotTyping: isTyping }),
  setIsModelThinking: (isThinking) => set({ isModelThinking: isThinking }),
  setClientId: (clientId) => set({ clientId: clientId }),

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
          content: '',
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


  // NEW: File Explorer State and Actions
  fileExplorer: {
    fileStructure: [],
    selectedFile: null,
    fileContent: '',
    isFileExplorerLoading: false,
    fileExplorerError: null,
    isFileViewDialogOpen: false,
    isFileEditing: false,

    fetchFileStructure: async () => {
      set((state) => ({ fileExplorer: { ...state.fileExplorer, isFileExplorerLoading: true, fileExplorerError: null } }));
      try {
        const data = await getFileStructure();
        const structureWithRelativePaths = get().fileExplorer.calculateRelativePaths(data);
        set((state) => ({ fileExplorer: { ...state.fileExplorer, fileStructure: structureWithRelativePaths } }));
      } catch (err) {
        set((state) => ({ fileExplorer: { ...state.fileExplorer, fileExplorerError: 'Failed to fetch file structure.' } }));
        console.error(err);
      } finally {
        set((state) => ({ fileExplorer: { ...state.fileExplorer, isFileExplorerLoading: false } }));
      }
    },

    selectFile: async (file: FileEntry) => {
      if (file.type === 'file' && file.relativePath) {
        set((state) => ({ fileExplorer: { ...state.fileExplorer, selectedFile: file, isFileExplorerLoading: true, fileExplorerError: null, isFileEditing: false } }));
        try {
          const content = await getFileContent(file.relativePath);
          set((state) => ({ fileExplorer: { ...state.fileExplorer, fileContent: content, isFileViewDialogOpen: true } }));
        } catch (err) {
          set((state) => ({ fileExplorer: { ...state.fileExplorer, fileExplorerError: `Failed to fetch content for ${file.name}.` } }));
          console.error(err);
        } finally {
          set((state) => ({ fileExplorer: { ...state.fileExplorer, isFileExplorerLoading: false } }));
        }
      } else if (file.type === 'directory') {
        console.log('Clicked directory:', file.name);
      }
    },

    updateFileContent: (content: string) => {
      set((state) => ({ fileExplorer: { ...state.fileExplorer, fileContent: content } }));
    },

    saveEditedFile: async () => {
      const { selectedFile, fileContent } = get().fileExplorer;
      if (selectedFile && selectedFile.relativePath) {
        set((state) => ({ fileExplorer: { ...state.fileExplorer, isFileExplorerLoading: true, fileExplorerError: null } }));
        try {
          await saveFile(selectedFile.relativePath, fileContent);
          alert('File saved successfully!');
          set((state) => ({ fileExplorer: { ...state.fileExplorer, isFileEditing: false } }));
          await get().fileExplorer.fetchFileStructure();
        } catch (err) {
          set((state) => ({ fileExplorer: { ...state.fileExplorer, fileExplorerError: `Failed to save ${selectedFile.name}.` } }));
          console.error(err);
        } finally {
          set((state) => ({ fileExplorer: { ...state.fileExplorer, isFileExplorerLoading: false } }));
        }
      }
    },

    deleteSelectedFile: async () => {
      const { selectedFile } = get().fileExplorer;
      if (selectedFile && selectedFile.relativePath) {
        if (!confirm(`Are you sure you want to delete ${selectedFile.name}?`)) {
          return;
        }
        set((state) => ({ fileExplorer: { ...state.fileExplorer, isFileExplorerLoading: true, fileExplorerError: null } }));
        try {
          await deleteFile(selectedFile.relativePath);
          alert('File deleted successfully!');
          set((state) => ({ fileExplorer: { ...state.fileExplorer, isFileViewDialogOpen: false, selectedFile: null, fileContent: '' } }));
          await get().fileExplorer.fetchFileStructure();
        } catch (err) {
          set((state) => ({ fileExplorer: { ...state.fileExplorer, fileExplorerError: `Failed to delete ${selectedFile.name}.` } }));
          console.error(err);
        } finally {
          set((state) => ({ fileExplorer: { ...state.fileExplorer, isFileExplorerLoading: false } }));
        }
      }
    },

    setIsFileEditing: (isEditing: boolean) => {
      set((state) => ({ fileExplorer: { ...state.fileExplorer, isFileEditing: isEditing } }));
    },

    setIsFileViewDialogOpen: (isOpen: boolean) => {
      set((state) => ({ fileExplorer: { ...state.fileExplorer, isFileViewDialogOpen: isOpen } }));
    },

    calculateRelativePaths: (structure: FileEntry[]): FileEntry[] => {
      const idMap = new Map<number, FileEntry>(structure.map(item => [item.id, item]));
      const getPath = (item: FileEntry): string => {
        if (item.parent_id === null || item.name === 'adk_projects_runner') {
          return item.name;
        }
        const parent = idMap.get(item.parent_id);
        if (parent) {
          return `${getPath(parent)}/${item.name}`;
        }
        return item.name;
      };

      return structure.map(item => ({
        ...item,
        relativePath: getPath(item).replace(/^adk_projects_runner\/?/, ''),
      }));
    },
  },
}));
