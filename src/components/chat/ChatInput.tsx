import React, { useState } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Send } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore'; // Import useAppStore
import { v4 as uuidv4 } from 'uuid'; // Import uuid for unique IDs

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const { sendMessage } = useSocket();
  const addChatMessage = useAppStore((state) => state.addChatMessage); // Get addChatMessage from the store

  const handleSendMessage = () => {
    if (message.trim()) {
      // Create the user message object
      const userMessage = {
        sender: 'user',
        content: message.trim(),
        type: 'text',
      };
      
      // Add the user message to the chat messages state
      addChatMessage(userMessage);

      // Send the message via socket (assuming sendMessage expects a string)
      sendMessage(message);

      setMessage('');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) { // Only send on Enter, not Shift+Enter
      event.preventDefault(); // Prevent new line in input
      handleSendMessage();
    }
  };

  return (
    <div className="flex items-center p-4 border-t bg-background">
      <Input
        placeholder="Type your message..."
        className="flex-1 mr-2"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <Button onClick={handleSendMessage} disabled={!message.trim()}>
        <Send className="h-5 w-5" />
        <span className="sr-only">Send message</span>
      </Button>
    </div>
  );
};

export default ChatInput;
