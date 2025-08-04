# adk_projects_runner

## How to Run and Test

1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`
3. Open your browser to the address provided by the development server (usually `http://localhost:5173`).

## Troubleshooting WebSocket Connection Issues

If you're experiencing issues with the WebSocket connection, consider the following:

1.  **Check Browser Console for Errors**: Open your browser's developer tools (usually by pressing F12) and navigate to the "Console" tab. Look for any WebSocket-related errors. These often provide specific details about why the connection failed (e.g., `WebSocket connection to 'ws://localhost:8000/ws/...' failed:`).

2.  **Verify Server Status**: Ensure that your WebSocket server is running and accessible at the expected address. The default WebSocket URL is `ws://localhost:8000/ws/<clientId>`. If your server is running on a different port or host, you'll need to configure it.

3.  **Check Network Issues**: Temporary network problems can prevent WebSocket connections. Try restarting your local network connection or testing from a different network if possible.

4.  **Environment Variable Configuration**: The WebSocket URL is configured using the `VITE_WEBSOCKET_URL` environment variable. If you're deploying the application or running it in a different environment, ensure this variable is correctly set.

    *   **Development**: You can create a `.env.local` file in the project root and add `VITE_WEBSOCKET_URL=ws://your-backend-host:your-port/ws`.
    *   **Production**: Ensure your hosting environment is configured to provide the `VITE_WEBSOCKET_URL` to the build process.

5.  **Firewall or Antivirus**: Sometimes, local firewalls or antivirus software can block WebSocket connections. Temporarily disabling them (with caution) can help diagnose if this is the issue.

6.  **CORS Issues**: If your frontend and backend are on different domains/ports, you might encounter Cross-Origin Resource Sharing (CORS) issues. Ensure your backend is configured to allow connections from your frontend's origin.

## Todo List


## Updates

- **2023-10-27**: Addressed the issue with empty chat bubbles and "undefined" text data by aligning the `ChatMessage` interface and data flow between `ChatMessage.tsx` and `useAppStore.ts`. The `content` field is now correctly populated and consumed.
- **2024-07-30**: Improved WebSocket connection robustness by adding detailed error logging and moving the WebSocket URL to an environment variable (`VITE_WEBSOCKET_URL`). Added a troubleshooting guide to `README.md` for common connection issues.
- **2024-07-30**: Implemented expandable/collapsible chat bubbles for 'function_call' and 'function_response' types, added scrollability for 'text' type messages, and introduced a typing indicator in the chat window.
- **2024-07-30**: Enhanced `FunctionCallBubble` to display a truncated argument summary when collapsed and increased the width of both `FunctionCallBubble` and `FunctionResponseBubble` for better readability.
- **2024-07-30**: Added a new "State Explorer" tab to view raw JSON data from the `/state/{client_id}` endpoint. This feature utilizes `react-router-dom` for routing and includes a dedicated component to fetch and display the state.
- **2024-07-30**: Updated the "State Explorer" tab to dynamically use the `clientId` from the application store in its link.