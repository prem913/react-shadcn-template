import { useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAppStore, type ChatMessage } from '../store/useAppStore';
import {
  connectWebSocket,
  sendWebSocketMessage,
  type LiveRunnerMessage,
} from '../lib/api';

/**
 * A custom hook to manage the WebSocket connection for the chat application.
 */
export const useSocket = () => {
  const {
    addChatMessage,
    setConnectionStatus,
    addStreamedBotChunk,
    addBotFunctionCallOrResponse,
    setIsBotTyping,
    finalizeBotMessage,
    setIsModelThinking, // Destructure the new setter
  } = useAppStore((state) => ({
    addChatMessage: state.addChatMessage,
    setConnectionStatus: state.setConnectionStatus,
    addStreamedBotChunk: state.addStreamedBotChunk,
    addBotFunctionCallOrResponse: state.addBotFunctionCallOrResponse,
    setIsBotTyping: state.setIsBotTyping,
    finalizeBotMessage: state.finalizeBotMessage,
    setIsModelThinking: state.setIsModelThinking, // Get the new setter from the store
  }));

  const clientIdRef = useRef<string>(null); // Change to null initially

  useEffect(() => {
    let currentClientId = localStorage.getItem('clientId');
    if (!currentClientId) {
      currentClientId = uuidv4();
      localStorage.setItem('clientId', currentClientId);
    }
    clientIdRef.current = currentClientId;

    const handleIncomingMessage = (message: LiveRunnerMessage) => {
      console.log('Received message from server:', message);
      switch (message.type) {
        case 'text':
          setIsBotTyping(true); // Still show typing for text
          setIsModelThinking(true); // Model is thinking while streaming text
          addStreamedBotChunk(message.data);
          break;
        case 'function_call':
          setIsModelThinking(true); // Model is thinking while making a function call
          addBotFunctionCallOrResponse('function_call', message.data);
          break;
        case 'function_response':
          setIsModelThinking(true); // Model is thinking while processing function response
          addBotFunctionCallOrResponse('function_response', message.data);
          break;
        case 'turn_complete':
          setIsModelThinking(false); // Model is done thinking
          finalizeBotMessage(); // Finalize any pending bot message (like streamed text)
          break;
      }
    };

    const connect = async () => {
      setConnectionStatus('connecting');
      try {
        // Use clientIdRef.current which is now guaranteed to be set
        await connectWebSocket(clientIdRef.current!, handleIncomingMessage);
        setConnectionStatus('connected');
      } catch (error) {
        console.error('WebSocket connection failed:', error);
        setConnectionStatus('error');
        setIsModelThinking(false); // Ensure thinking indicator is off on error
      }
    };

    connect();

  }, [setConnectionStatus, addStreamedBotChunk, addBotFunctionCallOrResponse, setIsBotTyping, finalizeBotMessage, setIsModelThinking]);

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
    setIsModelThinking(true); // Model starts thinking when user sends a message
    setIsBotTyping(false); // Reset bot typing when user sends a message

    // Send the message via WebSocket
    sendWebSocketMessage(text);
  };

  return { sendMessage };
};
