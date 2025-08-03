import React from 'react';
import { type ChatMessage as ChatMessageType } from '../../store/useAppStore';
import { Card, CardContent } from '../ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import { cn } from '../../lib/utils';

interface FunctionCallBubbleProps {
  message: ChatMessageType;
  isUser: boolean;
}

const FunctionCallBubble: React.FC<FunctionCallBubbleProps> = ({ message, isUser }) => {
  const formattedTimestamp = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(message.timestamp);

  // Determine background color based on message type and sender for consistency
  const bubbleBgClass = cn(
    isUser
      ? 'bg-blue-600 text-white rounded-br-none'
      : 'bg-muted rounded-bl-none',
    {
      // Prioritize distinct colors for function messages
      'bg-purple-600 text-white': isUser && (message.type === 'function_call' || message.type === 'function_response'),
      'bg-orange-600 text-white': !isUser && (message.type === 'function_call' || message.type === 'function_response'),
    }
  );

  const timestampClass = cn(
    'block text-right text-xs mt-1',
    isUser ? 'text-white/70' : 'text-muted-foreground'
  );

  const getSummary = () => {
    if (message.type === 'function_call') {
      const toolName = message.data?.tool_name || 'unknown_tool';
      const functionName = message.data?.function_name || 'unknown_function';
      const args = message.data?.args ? JSON.stringify(message.data.args) : '';
      return `Function Call: ${toolName}.${functionName}(${args})`;
    } else if (message.type === 'function_response') {
      const toolName = message.data?.tool_name || 'unknown_tool';
      const functionName = message.data?.function_name || 'unknown_function';
      const resultSummary = message.data?.result
        ? typeof message.data.result === 'string'
          ? message.data.result.substring(0, 50) + (message.data.result.length > 50 ? '...' : '')
          : 'Result Data'
        : 'No Result';
      return `Function Response from ${toolName}.${functionName}: ${resultSummary}`;
    }
    return 'Details'; // Fallback, though message.type should always be function_call or function_response here
  };

  return (
    <div
      className={cn(
        'flex w-full mb-2',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <Card className={cn('max-w-[70%] p-2 shadow-sm', bubbleBgClass)}>
        <CardContent className="p-0 text-sm">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left font-semibold">
                {getSummary()}
              </AccordionTrigger>
              <AccordionContent>
                <pre className="whitespace-pre-wrap text-wrap mt-2 p-2 bg-gray-800 text-white rounded-md overflow-auto max-h-40">
                  <code>{JSON.stringify(message.data, null, 2)}</code>
                </pre>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <span className={timestampClass}>
            {formattedTimestamp}
          </span>
        </CardContent>
      </Card>
    </div>
  );
};

export default FunctionCallBubble;
