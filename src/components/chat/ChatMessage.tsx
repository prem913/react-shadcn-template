import React from 'react';
import { Card, CardContent } from '../ui/card';
import { cn } from '../../lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FunctionCallBubble } from './FunctionCallBubble';
import { FunctionResponseBubble } from './FunctionResponseBubble';
import { User, Bot } from 'lucide-react'; // Import User and Bot icons

// Define TypeScript Interfaces
interface BaseChatMessage {
  type: string;
  sender: 'user' | 'tool';
  timestamp: Date;
}

interface FunctionCallMessage extends BaseChatMessage {
  type: "function_call";
  data: string; // stringified JSON of FunctionCallData
}

interface FunctionResponseMessage extends BaseChatMessage {
  type: "function_response";
  data: string; // stringified JSON of FunctionResponseData
}

interface TextMessage extends BaseChatMessage {
  type: "text";
  content: string; // The actual text content, changed from 'data' to 'content'
}

// Union type for all possible chat message types
export type ChatMessageType = FunctionCallMessage | FunctionResponseMessage | TextMessage;

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const isBot = message.sender === 'tool'; // Assuming 'tool' sender is bot for now

  const formattedTimestamp = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(message.timestamp);

  // Base styles for chat bubbles
  const commonBubbleClasses = "p-3 rounded-lg max-w-[70%] mb-2 break-words";

  const getBubbleClasses = () => {
    if (message.type === 'text') {
      return cn(
        commonBubbleClasses,
        isUser ? 'ml-auto bg-blue-600 text-white' : 'mr-auto bg-gray-700 text-white',
        "shadow-sm",
        isUser ? "rounded-br-none" : "rounded-bl-none"
      );
    } else {
      return cn(
        commonBubbleClasses,
        isUser ? 'ml-auto' : 'mr-auto'
      );
    }
  };

  const renderIcon = () => {
    if (isUser) {
      return <User className="h-6 w-6 text-gray-500 mr-2 flex-shrink-0" />;
    } else if (isBot) {
      return <Bot className="h-6 w-6 text-primary mr-2 flex-shrink-0" />;
    }
    return null;
  };

  switch (message.type) {
    case 'text':
      console.log('ChatMessage - Text Data:', (message as TextMessage).content);
      return (
        <div className={cn('flex w-full mb-2', isUser ? 'justify-end' : 'justify-start', isUser ? 'flex-row-reverse' : 'flex-row')}> {/* Added flex-row-reverse for user messages */}
          {renderIcon()}
          <Card className={getBubbleClasses()}>
            <CardContent className="p-0 text-sm max-h-[200px] overflow-y-auto break-words">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {(message as TextMessage).content}
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
        </div>
      );
    case 'function_call':
      return (
        <div className={cn('flex w-full mb-2', isUser ? 'justify-end' : 'justify-start', isUser ? 'flex-row-reverse' : 'flex-row')}> {/* Added flex-row-reverse for user messages */}
          {renderIcon()}
          <FunctionCallBubble data={message.data} timestamp={formattedTimestamp} isUser={isUser} />
        </div>
      );
    case 'function_response':
      return (
        <div className={cn('flex w-full mb-2', isUser ? 'justify-end' : 'justify-start', isUser ? 'flex-row-reverse' : 'flex-row')}> {/* Added flex-row-reverse for user messages */}
          {renderIcon()}
          <FunctionResponseBubble data={message.data} timestamp={formattedTimestamp} isUser={isUser} />
        </div>
      );
    default:
      return (
        <div className={cn('flex w-full mb-2', isUser ? 'justify-end' : 'justify-start', isUser ? 'flex-row-reverse' : 'flex-row')}> {/* Added flex-row-reverse for user messages */}
          {renderIcon()}
          <div className={`${getBubbleClasses()} bg-red-200 text-red-800`}>
            <p>Unknown message type</p>
            <pre className="break-words">{(message as any).data || (message as any).content}</pre>
          </div>
        </div>
      );
  }
};

export default ChatMessage;
