import React, { useState } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Send } from 'lucide-react';

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const { sendMessage } = useSocket();

  const handleSendMessage = () => {
    if (message.trim()) {
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
