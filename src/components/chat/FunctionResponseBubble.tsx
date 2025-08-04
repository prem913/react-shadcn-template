import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

interface FunctionResponseData {
  name: string;
  response: {
    result: string;
    [key: string]: any;
  };
}

interface FunctionResponseBubbleProps {
  data: string; // stringified JSON
  timestamp: string;
  isUser: boolean;
}

export const FunctionResponseBubble: React.FC<FunctionResponseBubbleProps> = ({ data, isUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  let parsedData: FunctionResponseData | null = null;
  try {
    parsedData = JSON.parse(data) as FunctionResponseData;
    console.log('FunctionResponseBubble - Name:', parsedData.name);
    console.log('FunctionResponseBubble - Result:', parsedData.response.result);
  } catch (e) {
    console.error("Failed to parse function response JSON:", e);
    return (
      <Card className={cn("max-w-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-50", isUser ? "ml-auto" : "mr-auto")}>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Invalid Function Response Data</CardTitle>
        </CardHeader>
        <CardContent className="text-xs relative break-words">
          <p className="text-xs text-red-500">Error parsing function response: {data}</p>
        </CardContent>
      </Card>
    );
  }

  // Determine a summary for the collapsed state
  const summary = parsedData.response.result ? `Result: ${parsedData.response.result.substring(0, 50)}${parsedData.response.result.length > 50 ? "..." : ""}` : "No result";

  return (
    <Card className={cn("w-[50%] bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-50", isUser ? "ml-auto" : "mr-auto", "shadow-sm", isUser ? "rounded-br-none" : "rounded-bl-none")}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-semibold overflow-hidden text-ellipsis whitespace-nowrap">
            {isOpen ? `Function Response: ${parsedData.name}` : `Response: ${summary}`}
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
            <div className="font-medium mb-1">
              <span>Result:</span>
            </div>
            <pre className="whitespace-pre-wrap break-all bg-green-50 dark:bg-green-800 p-2 rounded-md text-green-800 dark:text-green-200 mb-6 max-h-40 overflow-y-auto">
              <code>{parsedData.response.result}</code>
            </pre>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
