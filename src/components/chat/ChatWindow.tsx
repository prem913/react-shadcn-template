// @ts-nocheck
/* eslint-disable */
import React, { useEffect, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';
import ChatMessage from './ChatMessage';
import { ScrollArea } from '../ui/scroll-area';
import { Skeleton } from '../ui/skeleton';
import { cn } from '../../lib/utils';

const ChatWindow: React.FC = () => {
  const { chatMessages, isModelThinking } = useAppStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isModelThinking]); // Add isModelThinking to dependency array to scroll when thinking starts/stops

  return (
    <div className="flex flex-col h-full"> {/* Main container for flex column layout */}
      <ScrollArea className="flex-1 p-4"> {/* ScrollArea takes remaining height */}
        <div className="flex flex-col space-y-2">
          {chatMessages.map((message) => (
            <ChatMessage key={message.id} message={message} /> 
          ))}
          {isModelThinking && (
            <div className="flex w-full mb-2 justify-start">
              <div
                className={cn(
                  'max-w-[70%] p-2 bg-muted rounded-bl-none shadow-sm',
                  'flex items-center space-x-2' // For the pulsing dots
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