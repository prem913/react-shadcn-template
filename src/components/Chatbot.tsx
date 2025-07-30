import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PaperAirplaneIcon, UserCircleIcon, ChatBubbleLeftRightIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

export function Chatbot() {
  const [messageInput, setMessageInput] = useState('');
  const { chatMessages, sendChatMessage, isSendingMessage, selectedApplication } = useAppStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (messageInput.trim() && !isSendingMessage) {
      await sendChatMessage(messageInput);
      setMessageInput('');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      <div className="p-4 border-b bg-gray-50 dark:bg-gray-900 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Chat with {selectedApplication?.name || 'Application'}
        </h2>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {chatMessages.map((message, index) => (
            <div
              key={message.id}
              className={cn(
                "flex items-end gap-3",
                message.sender === 'user' ? "justify-end" : "justify-start"
              )}
            >
              {message.sender === 'bot' && (
                <div className="flex-shrink-0">
                  <ChatBubbleLeftRightIcon className="w-7 h-7 text-blue-500 dark:text-blue-400" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[70%] p-3 rounded-lg shadow-md break-words transition-all duration-300 ease-in-out",
                  message.sender === 'user'
                    ? "bg-blue-500 text-white rounded-br-none" 
                    : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-bl-none"
                )}
              >
                <p className="text-sm md:text-base">{message.content}</p>
                <span className={cn("block mt-1 text-xs", message.sender === 'user' ? "text-blue-100" : "text-gray-500 dark:text-gray-400")}>
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              {message.sender === 'user' && (
                <div className="flex-shrink-0">
                  <UserCircleIcon className="w-7 h-7 text-gray-600 dark:text-gray-300" />
                </div>
              )}
            </div>
          ))}
          {isSendingMessage && (
            <div className="flex items-end gap-3 justify-start">
              <div className="flex-shrink-0">
                <ChatBubbleLeftRightIcon className="w-7 h-7 text-blue-500 dark:text-blue-400" />
              </div>
              <div className="max-w-[70%] p-3 rounded-lg shadow-md bg-gray-200 dark:bg-gray-700 rounded-bl-none animate-pulse">
                <ArrowPathIcon className="h-5 w-5 animate-spin text-gray-500 dark:text-gray-400" />
                <span className="sr-only">Bot is typing...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      <div className="p-4 border-t bg-gray-50 dark:bg-gray-900 flex items-center gap-2 shadow-inner">
        <Input
          type="text"
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSendingMessage}
        />
        <Button onClick={handleSendMessage} disabled={isSendingMessage || !messageInput.trim()} className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800">
          {isSendingMessage ? (
            <ArrowPathIcon className="h-4 w-4 animate-spin" />
          ) : (
            <PaperAirplaneIcon className="h-4 w-4" />
          )}
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </div>
  );
}
