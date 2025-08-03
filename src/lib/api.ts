
/**
 * Represents a message sent to or received from the WebSocket server.
 */
export interface LiveRunnerMessage {
  type: 'end' | 'text' | 'interrupted' | 'turn_complete' | 'function_call' | 'function_response';
  data: string;
}

/**
 * A function type for the callback that handles incoming WebSocket messages.
 */
export type MessageHandler = (message: LiveRunnerMessage) => void;

let socket: WebSocket | null = null;

/**
 * Connects to the WebSocket server and sets up message handling.
 * @param {string} clientId - A unique identifier for the client.
 * @param {MessageHandler} onMessage - The callback function to process incoming messages.
 * @returns {Promise<WebSocket>} A promise that resolves with the WebSocket instance.
 */
export const connectWebSocket = (clientId: string, onMessage: MessageHandler): Promise<WebSocket> => {
  return new Promise((resolve, reject) => {
    // Prevent multiple connections
    if (socket && socket.readyState === WebSocket.OPEN) {
      console.log('WebSocket is already connected.');
      resolve(socket);
      return;
    }

    // Establish a new connection
    const wsUrl = import.meta.env.VITE_WEBSOCKET_URL || `ws://localhost:8000/ws/${clientId}`;
    console.log(`Attempting to connect to WebSocket at: ${wsUrl}`);
    socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log('WebSocket connection established.');
      resolve(socket);
    };

    socket.onmessage = (event) => {
      try {
        const message: LiveRunnerMessage = JSON.parse(event.data);
        onMessage(message);
      } catch (error) {
        console.error('Failed to parse incoming message:', error);
      }
    };

    socket.onerror = (event) => {
      console.error('WebSocket error occurred:', event);
      // Attempt to get more specific error information
      if ((event as WebSocketErrorEvent).code) {
        console.error(`WebSocket Error Code: ${(event as WebSocketErrorEvent).code}`);
      }
      if ((event as WebSocketErrorEvent).reason) {
        console.error(`WebSocket Error Reason: ${(event as WebSocketErrorEvent).reason}`);
      }
      reject(new Error(`WebSocket connection failed. Check console for details. URL: ${wsUrl}`));
    };

    socket.onclose = (event) => {
      console.log(`WebSocket connection closed. Code: ${event.code}, Reason: ${event.reason}`);
      if (!event.wasClean) {
        console.error('WebSocket connection closed unexpectedly.');
      }
      socket = null;
    };
  });
};

/**
 * Sends a message through the active WebSocket connection.
 * @param {string} text - The text content to send.
 */
export const sendWebSocketMessage = (text: string) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    const message: LiveRunnerMessage = {
      type: 'text',
      data: text,
    };
    socket.send(JSON.stringify(message));
  } else {
    console.error('WebSocket is not connected or is in a closing state.');
  }
};

/**
 * Closes the WebSocket connection if it is open.
 */
export const disconnectWebSocket = () => {
  if (socket) {
    console.log('Disconnecting WebSocket...');
    socket.close();
  }
};

// Define a minimal interface for WebSocketErrorEvent if it's not globally available
interface WebSocketErrorEvent extends Event {
  colno: number;
  filename: string;
  lineno: number;
  message: string;
  error: any;
  // Custom properties often found in WebSocket errors
  code?: number;
  reason?: string;
}