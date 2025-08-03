import { useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAppStore, type ChatMessage } from '../store/useAppStore';
import {
  connectWebSocket,
  disconnectWebSocket,
  sendWebSocketMessage,
  type LiveRunnerMessage,
} from '../lib/api';

/**
 * A custom hook to manage the WebSocket connection for the chat application.
 */
export const useSocket = () => {
  const {
    selectedApplication,
    addChatMessage,
    setConnectionStatus,
    appendBotMessage,
    finalizeBotMessage,
  } = useAppStore((state) => ({
    selectedApplication: state.selectedApplication,
    addChatMessage: state.addChatMessage,
    setConnectionStatus: state.setConnectionStatus,
    appendBotMessage: state.appendBotMessage,
    finalizeBotMessage: state.finalizeBotMessage,
  }));

  const clientIdRef = useRef<string>(uuidv4()); // Stable client ID across re-renders

  useEffect(() => {
    if (!selectedApplication) {
      disconnectWebSocket();
      setConnectionStatus('disconnected');
      return;
    }

    const handleIncomingMessage = (message: LiveRunnerMessage) => {
      console.log('Received message from server:', message);
      switch (message.type) {
        case 'text':
          // Append the text chunk to the current bot message
          appendBotMessage(message.data);
          break;
        case 'turn_complete':
          // Finalize the bot's message stream
          finalizeBotMessage();
          break;
        case 'end':
        case 'interrupted':
          // Handle session end or interruption
          console.log(`Session event: ${message.type}`);
          finalizeBotMessage();
          break;
      }
    };

    const connect = async () => {
      setConnectionStatus('connecting');
      try {
        await connectWebSocket(clientIdRef.current, handleIncomingMessage);
        setConnectionStatus('connected');
      } catch (error) {
        console.error('WebSocket connection failed:', error);
        setConnectionStatus('error');
      }
    };

    connect();

    // Cleanup on component unmount or when the selected application changes
    return () => {
      disconnectWebSocket();
      setConnectionStatus('disconnected');
    };
  }, [selectedApplication, setConnectionStatus, appendBotMessage, finalizeBotMessage]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: uuidv4(),
      sender: 'user',
      content: text,
      timestamp: new Date(),
    };
    addChatMessage(userMessage);

    // Send the message via WebSocket
    sendWebSocketMessage(text);
  };

  return { sendMessage };
};
