import React from 'react';
import { type ChatMessage as ChatMessageType } from '../../store/useAppStore';
import { Card, CardContent } from '../ui/card';
import { cn } from '../../lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import FunctionCallBubble from './FunctionCallBubble';

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
      {message.type === 'text' && (
        <Card
          className={cn(
            'max-w-[70%] p-2 shadow-sm',
            isUser
              ? 'bg-blue-600 rounded-br-none text-white' // User: Blue background, white text
              : 'bg-muted rounded-bl-none', // Agent: Muted background
            {
              // For agent text messages, override background to gray-700 and ensure white text
              'bg-gray-700 text-white': !isUser && message.type === 'text',
              // Ensure user text messages are explicitly white, though already in the main class
              'text-white': isUser && message.type === 'text',
            }
          )}
        >
          <CardContent className="p-0 text-sm min-h-[20px]"> {/* Added min-height */}
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
            <span
              className={cn(
                'block text-right text-xs mt-1',
                isUser ? 'text-white/70' : 'text-muted-foreground'
              )}
            >
              {formattedTimestamp}
            </span>
          </CardContent>
        </Card>
      )}

      {(message.type === 'function_call' || message.type === 'function_response') && (
        <FunctionCallBubble message={message} isUser={isUser} />
      )}
    </div>
  );
};

export default ChatMessage;
