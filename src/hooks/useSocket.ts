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
    addStreamedBotChunk,
    addBotFunctionCallOrResponse,
    setIsBotTyping,
    finalizeBotMessage,
  } = useAppStore((state) => ({
    selectedApplication: state.selectedApplication,
    addChatMessage: state.addChatMessage,
    setConnectionStatus: state.setConnectionStatus,
    addStreamedBotChunk: state.addStreamedBotChunk,
    addBotFunctionCallOrResponse: state.addBotFunctionCallOrResponse,
    setIsBotTyping: state.setIsBotTyping,
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
      setIsBotTyping(true); // Always set to typing when a message comes in
      switch (message.type) {
        case 'text':
          addStreamedBotChunk(message.data);
          break;
        case 'function_call':
          addBotFunctionCallOrResponse('function_call', message.data);
          break;
        case 'function_response':
          addBotFunctionCallOrResponse('function_response', message.data);
          break;
        case 'turn_finish':
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
  }, [selectedApplication, setConnectionStatus, addStreamedBotChunk, addBotFunctionCallOrResponse, setIsBotTyping, finalizeBotMessage]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: uuidv4(),
      sender: 'user',
      content: text,
      timestamp: new Date(),
      type: 'text',
    };
    addChatMessage(userMessage);

    // Send the message via WebSocket
    sendWebSocketMessage(text);
  };

  return { sendMessage };
};
