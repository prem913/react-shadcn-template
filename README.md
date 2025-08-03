# adk_projects_runner

## How to Run and Test

1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`
3. Open your browser to the address provided by the development server (usually `http://localhost:5173`).

## Todo List

- [x] Fix empty user side chat bubbles.
- [ ] Make a separate chat bubble for each message of type text.

## Updates

- **2023-10-27**: Addressed the issue with empty chat bubbles and "undefined" text data by aligning the `ChatMessage` interface and data flow between `ChatMessage.tsx` and `useAppStore.ts`. The `content` field is now correctly populated and consumed.