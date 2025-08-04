import { useEffect, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';

export const useSocket = () => {
  const { setConnectionStatus, clientId, setClientId } = useAppStore(); // Destructure clientId and setClientId

  const websocketUrl = import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:8000/ws';

  const connectSocket = useCallback(() => {
    setConnectionStatus('connecting');

    let currentClientId = clientId; // Get clientId from store
    if (!currentClientId) {
      // If clientId not in store, try localStorage
      currentClientId = localStorage.getItem('clientId');
      if (!currentClientId) {
        // Generate a new clientId if not found anywhere
        currentClientId = 'client_' + Math.random().toString(36).substring(2, 15);
      }
      localStorage.setItem('clientId', currentClientId); // Persist to localStorage
      setClientId(currentClientId); // Update the store
    }

    const ws = new WebSocket(`${websocketUrl}/${currentClientId}`);

    ws.onopen = () => {
      console.log('WebSocket Connected');
      setConnectionStatus('connected');
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('WebSocket message received:', message);
      // Add your message handling logic here
    };

    ws.onclose = (event) => {
      console.log('WebSocket Disconnected:', event);
      setConnectionStatus('disconnected');
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
      setConnectionStatus('error');
      ws.close();
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [setConnectionStatus, clientId, setClientId, websocketUrl]); // Add clientId to dependencies

  useEffect(() => {
    connectSocket();
  }, [connectSocket]);

  return { connectSocket };
};