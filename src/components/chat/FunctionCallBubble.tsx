import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "../../lib/utils";

interface FunctionCallData {
  name: string;
  args: {
    [key: string]: any;
  };
}

interface FunctionCallBubbleProps {
  data: string; // stringified JSON
  timestamp: string;
  isUser: boolean;
}

export const FunctionCallBubble: React.FC<FunctionCallBubbleProps> = ({ data, timestamp, isUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  let parsedData: FunctionCallData | null = null;
  try {
    parsedData = JSON.parse(data) as FunctionCallData;
    console.log('FunctionCallBubble - Name:', parsedData.name);
    console.log('FunctionCallBubble - Args:', parsedData.args);
  } catch (e) {
    console.error("Failed to parse function call JSON:", e);
    return (
      <Card className={cn("max-w-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-50", isUser ? "ml-auto" : "mr-auto")}>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Invalid Function Call Data</CardTitle>
        </CardHeader>
        <CardContent className="text-xs relative break-words">
          <p className="text-xs text-red-500">Error parsing function call: {data}</p>
          <span className="absolute bottom-1 right-2 text-[0.6rem] text-gray-900/70 dark:text-gray-50/70">
            {timestamp}
          </span>
        </CardContent>
      </Card>
    );
  }

  const handleRunTool = () => {
    if (parsedData) {
      console.log("Running tool:", parsedData.name, "with args:", parsedData.args);
      // In a future step, this would trigger the actual function execution.
    }
  };

  const argsSummary = parsedData.args
    ? Object.entries(parsedData.args)
        .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
        .join(", ")
    : "";
  
  const truncatedArgsSummary = argsSummary.length > 50 ? `${argsSummary.substring(0, 50)}...` : argsSummary;

  return (
    <Card className={cn("max-w-xl bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-50", isUser ? "ml-auto" : "mr-auto", "shadow-sm", isUser ? "rounded-br-none" : "rounded-bl-none")}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3">
          <CardTitle className="text-sm font-semibold overflow-hidden text-ellipsis whitespace-nowrap">
            {isOpen ? `Function Call: ${parsedData.name}` : `Call: ${parsedData.name}(${truncatedArgsSummary})`}
          </CardTitle>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              <ChevronDownIcon className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent className="overflow-hidden">
          <CardContent className="text-xs relative p-3 pt-0 break-words">
            <div className="font-medium mb-1">
              <span>Arguments:</span>
            </div>
            <pre className="whitespace-pre-wrap break-all bg-blue-50 dark:bg-blue-800 p-2 rounded-md text-blue-800 dark:text-blue-200 mb-6 max-h-40 overflow-y-auto">
              <code>{JSON.stringify(parsedData.args, null, 2)}</code>
            </pre>
            <Button onClick={handleRunTool} className="mt-2 w-full">
              Run Tool
            </Button>
            <span className="absolute bottom-1 right-2 text-[0.6rem] text-blue-900/70 dark:text-blue-50/70">
              {timestamp}
            </span>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
