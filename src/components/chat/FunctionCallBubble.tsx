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

export const FunctionCallBubble: React.FC<FunctionCallBubbleProps> = ({ data, isUser }) => {
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
        </CardContent>
      </Card>
    );
  }


  const argsSummary = parsedData.args
    ? Object.entries(parsedData.args)
        .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
        .join(", ")
    : "";
  
  const truncatedArgsSummary = argsSummary.length > 50 ? `${argsSummary.substring(0, 50)}...` : argsSummary;

  return (
    <Card className={cn("min-w-lg max-w-xl bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-50", isUser ? "ml-auto" : "mr-auto", "shadow-sm", isUser ? "rounded-br-none" : "rounded-bl-none")}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-semibold overflow-hidden text-ellipsis whitespace-nowrap max-w-[70%]">
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
          <CardContent className="text-xs relative pt-0 break-words">
            {Object.keys(parsedData.args).length > 0 && (
            <div className="font-medium mb-1">
              <span>Arguments:</span>
            </div>
            )}
            {
              Object.keys(parsedData.args).map(key =>{
                return (
                  <pre key={key} className="whitespace-pre-wrap break-all bg-blue-50 dark:bg-blue-800 p-2 rounded-md text-blue-800 dark:text-blue-50 mb-6 max-h-40 overflow-y-auto">
                    <b>{key}: </b><code>{JSON.stringify(parsedData.args[key])}</code>
                  </pre>
                );
              })
            }
            {
              Object.keys(parsedData.args).length === 0 && (
                <p className="text-gray-500">No arguments provided.</p>
              )
            }
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
