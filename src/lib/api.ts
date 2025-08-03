
/**
 * Represents a message sent to or received from the WebSocket server.
 */
export interface LiveRunnerMessage {
  type: 'end' | 'text' | 'interrupted' | 'turn_complete';
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
    const wsUrl = `ws://localhost:8000/ws/${clientId}`;
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

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      reject(error);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed.');
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
    console.error('WebSocket is not connected.');
  }
};

/**
 * Closes the WebSocket connection if it is open.
 */
export const disconnectWebSocket = () => {
  if (socket) {
    socket.close();
  }
};

