import React from 'react';
import { type ChatMessage as ChatMessageType } from '../../store/useAppStore';
import { Card, CardContent } from '../ui/card';
import { cn } from '../../lib/utils';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  const formattedTimestamp = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(message.timestamp);

  return (
    <div
      className={cn(
        'flex w-full mb-2',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <Card
        className={cn(
          'max-w-[70%] p-2',
          isUser
            ? 'bg-primary/10 text-primary-foreground rounded-br-none'
            : 'bg-muted rounded-bl-none',
          'shadow-sm'
        )}
      >
        <CardContent className="p-0 text-sm">
          <p>{message.content}</p>
          <span
            className={cn(
              'block text-right text-xs mt-1',
              isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
            )}
          >
            {formattedTimestamp}
          </span>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatMessage;
