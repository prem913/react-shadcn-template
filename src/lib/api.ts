
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
      resolve(socket!);  // eslint-disable-line
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

/**
 * Fetches the state for a given client ID.
 * @param {string} clientId - The ID of the client.
 * @returns {Promise<any>} A promise that resolves with the client's state data.
 */
export const getState = async (clientId: string): Promise<any> => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const response = await fetch(`${apiUrl}/state/${clientId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch state for client ${clientId}: ${response.statusText}`);
  }
  return await response.json();
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

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const getFileStructure = async (): Promise<any[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/fs/structure`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching file structure:", error);
    throw error;
  }
};

export const getFileContent = async (relativePath: string): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/fs/content?relative_path=${encodeURIComponent(relativePath)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.content; // Extract content from the JSON response
  } catch (error) {
    console.error(`Error fetching content for ${relativePath}:`, error);
    throw error;
  }
};

export const saveFile = async (relativePath: string, code: string): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/fs/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ relative_path: relativePath, code: code }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.text(); // Confirmation message
  } catch (error) {
    console.error(`Error saving ${relativePath}:`, error);
    throw error;
  }
};

export const deleteFile = async (relativePath: string): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/fs/delete?relative_path=${encodeURIComponent(relativePath)}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.text(); // Confirmation message
  } catch (error) {
    console.error(`Error deleting ${relativePath}:`, error);
    throw error;
  }
};
