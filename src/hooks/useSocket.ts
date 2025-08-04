import { useEffect, useCallback, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';

export const useSocket = () => {
  const { setConnectionStatus, clientId, setClientId, addChatMessage } = useAppStore(); // Add addChatMessage
  const wsRef = useRef<WebSocket | null>(null); // Create a ref to hold the WebSocket instance

  const websocketUrl = import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:8000/ws';

  const connectSocket = useCallback(() => {
    setConnectionStatus('connecting');

    let currentClientId = clientId;
    if (!currentClientId) {
      currentClientId = localStorage.getItem('clientId');
      if (!currentClientId) {
        currentClientId = 'client_' + Math.random().toString(36).substring(2, 15);
      }
      localStorage.setItem('clientId', currentClientId);
      setClientId(currentClientId);
    }

    if (wsRef.current) {
      wsRef.current.close(); // Close existing connection if any
    }

    const ws = new WebSocket(`${websocketUrl}/${currentClientId}`);

    ws.onopen = () => {
      console.log('WebSocket Connected');
      setConnectionStatus('connected');
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('WebSocket message received:', message);
      // Assuming the message format from the server is compatible with ChatMessage
      // You might need to adjust this based on actual server message structure
      if (message.type === 'text' || message.type === 'function_call' || message.type === 'function_response') {
        addChatMessage({
          sender: message.sender,
          content: message.content || '', // Ensure content is not undefined for text
          type: message.type,
          data: message.data,
        });
      }
    };

    ws.onclose = (event) => {
      console.log('WebSocket Disconnected:', event);
      setConnectionStatus('disconnected');
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
      setConnectionStatus('error');
      if (wsRef.current) {
        wsRef.current.close();
      }
    };

    wsRef.current = ws;

    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    };
  }, [setConnectionStatus, clientId, setClientId, addChatMessage, websocketUrl]);

  const sendMessage = useCallback((message: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const chatMessage = {
        id: 'user_' + Date.now(),
        sender: 'user',
        content: message,
        timestamp: new Date().toISOString(),
        type: 'text',
      };
      wsRef.current.send(JSON.stringify(chatMessage));
      addChatMessage({ sender: 'user', content: message, type: 'text' });
    } else {
      console.warn('WebSocket is not connected. Message not sent.');
    }
  }, [addChatMessage]);


  useEffect(() => {
    connectSocket();
  }, [connectSocket]);

  return { connectSocket, sendMessage };
};