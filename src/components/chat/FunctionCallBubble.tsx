import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

interface FunctionCallData {
  name: string;
  args: {
    [key: string]: any;
  };
}

interface FunctionCallBubbleProps {
  data: string; // stringified JSON
  timestamp: string;
}

export const FunctionCallBubble: React.FC<FunctionCallBubbleProps> = ({ data, timestamp }) => {
  let parsedData: FunctionCallData | null = null;
  try {
    parsedData = JSON.parse(data) as FunctionCallData;
    console.log('FunctionCallBubble - Name:', parsedData.name); // Added console log
    console.log('FunctionCallBubble - Args:', parsedData.args); // Added console log
  } catch (e) {
    console.error("Failed to parse function call JSON:", e);
    return (
      <Card className="max-w-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-50">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Invalid Function Call Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-red-500">Error parsing function call: {data}</p>
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

  return (
    <Card className="max-w-md bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-50">
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Function Call: {parsedData.name}</CardTitle>
      </CardHeader>
      <CardContent className="text-xs relative">
        <p className="font-medium mb-1">Arguments:</p>
        <pre className="whitespace-pre-wrap break-all bg-blue-50 dark:bg-blue-800 p-2 rounded-md text-blue-800 dark:text-blue-200 mb-6">
          <code>{JSON.stringify(parsedData.args, null, 2)}</code>
        </pre>
        <Button onClick={handleRunTool} className="mt-2 w-full">
          Run Tool
        </Button>
        <span className="absolute bottom-1 right-2 text-[0.6rem] text-blue-900/70 dark:text-blue-50/70">
          {timestamp}
        </span>
      </CardContent>
    </Card>
  );
};
