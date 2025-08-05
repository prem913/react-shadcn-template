// @ts-nocheck
/* eslint-disable */
import React, { useEffect, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';
import ChatMessage from './ChatMessage';
import { ScrollArea } from '../ui/scroll-area';
import { Skeleton } from '../ui/skeleton';
import { cn } from '../../lib/utils';

interface ChatWindowProps {
  className?: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ className }) => {
  const { chatMessages, isModelThinking } = useAppStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isModelThinking]);

  return (
    <div className={cn("flex flex-col-reverse h-full overflow-y-auto", className)}> {/* Modified for full height, reverse order, and scroll */}
      <ScrollArea className="flex-grow p-4"> {/* Changed flex-1 to flex-grow for clarity */}
        <div className="flex flex-col space-y-2 justify-end"> {/* justify-end to keep content at bottom */}
          {chatMessages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isModelThinking && (
            <div className="flex w-full mb-2 justify-start">
              <div
                className={cn(
                  'max-w-[70%] p-2 bg-muted rounded-bl-none shadow-sm',
                  'flex items-center space-x-2'
                )}
              >
                <Skeleton className="h-2 w-2 rounded-full animate-pulse" />
                <Skeleton className="h-2 w-2 rounded-full animate-pulse delay-75" />
                <Skeleton className="h-2 w-2 rounded-full animate-pulse delay-150" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatWindow; 