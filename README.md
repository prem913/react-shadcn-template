# ADK Projects Runner

This is a React application featuring a sidebar for available applications and a main content area with an interactive chatbot.

## Technologies Used

* **React**
* **TypeScript**
* **Tailwind CSS**
* **Shadcn/ui**
* **Zustand** for state management
* **Heroicons** for icons

## How to Run the Application

1. **Node.js and npm/yarn:** Ensure you have Node.js (v18 or higher recommended) and npm (or yarn) installed on your system.
2. **Install Dependencies:** Navigate to the project root directory in your terminal and run:

    ```bash
    npm install
    # or
    yarn install
    ```

3. **Start Development Server:** Once dependencies are installed, start the development server:

    ```bash
    npm run dev
    # or
    yarn dev
    ```

    The application will typically be available at `http://localhost:5173/` (or another port if 5173 is in use).

## How to Test the Application

Currently, there are no automated tests configured. To test the application:

1. **Open in Browser:** Access the application through the URL provided by the development server.
2. **Interact with Sidebar:** Click on different applications in the sidebar to see if the selection changes.
3. **Interact with Chatbot:** Type messages into the input field and press Enter or click the Send button. Observe bot responses and loading indicators.
4. **Resize Panels:** Drag the handle between the sidebar and the chatbot to test resizing functionality.

## Features to Implement

*   **Real-time Chat Display**: Messages from both user and bot will be displayed in real-time with distinct styling to differentiate the sender.
*   **Message Input with Send Button**: A dedicated input field will allow users to type messages, accompanied by a send button to submit them.
*   **Bot Typing Indicator**: A visual cue will indicate when the bot is actively generating a response.
*   **WebSocket Connection Status Display**: The current status of the WebSocket connection (e.g., connected, disconnected, connecting, error) will be visibly displayed.
*   **Application Selection in the Sidebar**: Users will be able to select different chatbot "applications" or agents from a list in the sidebar.

## Todo List

*   Styling and User Experience Refinements: In progress
