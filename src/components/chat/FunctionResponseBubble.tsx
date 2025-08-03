import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";

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
}

export const FunctionResponseBubble: React.FC<FunctionResponseBubbleProps> = ({ data, timestamp }) => {
  let parsedData: FunctionResponseData | null = null;
  try {
    parsedData = JSON.parse(data) as FunctionResponseData;
    console.log('FunctionResponseBubble - Name:', parsedData.name); // Added console log
    console.log('FunctionResponseBubble - Result:', parsedData.response.result); // Added console log
  } catch (e) {
    console.error("Failed to parse function response JSON:", e);
    return (
      <Card className="max-w-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-50">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Invalid Function Response Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-red-500">Error parsing function response: {data}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-semibold">Function Response</CardTitle>
        <Badge className="bg-green-500 dark:bg-green-700 text-white">
          {parsedData.name}
        </Badge>
      </CardHeader>
      <CardContent className="text-xs relative">
        <p className="font-medium mb-1">Result:</p>
        <pre className="whitespace-pre-wrap break-all bg-green-50 dark:bg-green-800 p-2 rounded-md text-green-800 dark:text-green-200 mb-6">
          <code>{parsedData.response.result}</code>
        </pre>
        <span className="absolute bottom-1 right-2 text-[0.6rem] text-green-900/70 dark:text-green-50/70">
          {timestamp}
        </span>
      </CardContent>
    </Card>
  );
};
