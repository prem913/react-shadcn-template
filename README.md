# ADK Projects Runner

This is a React application featuring a sidebar for available applications and a main content area with an interactive chatbot.

## Technologies Used

*   **React**
*   **TypeScript**
*   **Tailwind CSS**
*   **Shadcn/ui**
*   **Zustand** for state management
*   **Heroicons** for icons

## How to Run the Application

1.  **Node.js and npm/yarn:** Ensure you have Node.js (v18 or higher recommended) and npm (or yarn) installed on your system.
2.  **Install Dependencies:** Navigate to the project root directory in your terminal and run:
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Start Development Server:** Once dependencies are installed, start the development server:
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The application will typically be available at `http://localhost:5173/` (or another port if 5173 is in use).

## How to Test the Application

Currently, there are no automated tests configured. To test the application:

1.  **Open in Browser:** Access the application through the URL provided by the development server.
2.  **Interact with Sidebar:** Click on different applications in the sidebar to see if the selection changes.
3.  **Interact with Chatbot:** Type messages into the input field and press Enter or click the Send button. Observe bot responses and loading indicators.
4.  **Resize Panels:** Drag the handle between the sidebar and the chatbot to test resizing functionality.

## Todo List

- [x] Update `README.md` with run/test instructions and todo list.
- [x] Install `zustand`.
- [x] Create Zustand store for application state management.
- [x] Implement mock API for fetching applications and sending chat messages.
- [x] Develop `ApplicationsPage` as the main layout using `ResizablePanelGroup`.
- [x] Create `ApplicationsSidebar` component to display applications with loading skeletons and active states.
- [x] Build `Chatbot` component with message display, input, send functionality, loading indicators, avatars, and auto-scrolling.
- [x] Integrate `ApplicationsPage` into `App.tsx`.
- [x] Refine styling with Tailwind CSS for responsiveness and theme consistency.
- [x] Ensure `package.json` includes all new dependencies.
- [x] Verify `main.tsx` renders `App` correctly.
- [x] Replace `lucide-react` with `Heroicons` for all icons.
- [x] Update `README.md` to reflect the use of Heroicons.
