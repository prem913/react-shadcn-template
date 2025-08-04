import React, { useState, useEffect } from 'react';
import { getState } from '../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ScrollArea } from '../components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../components/ui/accordion';

const StateExplorer: React.FC = () => {
  const [stateData, setStateData] = useState<any>(null);
  const [eventsData, setEventsData] = useState<any[]>([]); // New state for events
  const [error, setError] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);

  useEffect(() => {
    const storedClientId = localStorage.getItem('clientId');
    if (storedClientId) {
      setClientId(storedClientId);
      getState(storedClientId)
        .then(data => {
          setStateData(data.state);
          setEventsData(data.events || []); // Populate eventsData
        })
        .catch(err => {
          setError(err.message);
        });
    } else {
      setError('No client ID found in local storage.');
    }
  }, []);

  const renderContent = (content: any) => {
    if (!content || !content.parts) return <p className="text-gray-500">No content parts</p>;

    return content.parts.map((part: any, index: number) => (
      <div key={index} className="mt-2 text-sm space-y-2">
        {part.text && <p className="whitespace-pre-wrap p-2 rounded-md bg-gray-50 border border-gray-200">{part.text}</p>}
        {part.functionCall && (
          <div className="bg-blue-50 p-3 rounded-md border border-blue-200 border-l-4 border-l-blue-500 shadow-sm">
            <strong className="text-blue-700">Function Call:</strong> <span className="font-mono text-blue-800">{part.functionCall.name}</span>
            <pre className="whitespace-pre-wrap text-xs bg-blue-100 p-2 rounded-md mt-1">
              {JSON.stringify(part.functionCall.args, null, 2)}
            </pre>
          </div>
        )}
        {part.functionResponse && (
          <div className="bg-green-50 p-3 rounded-md border border-green-200 border-l-4 border-l-green-500 shadow-sm">
            <strong className="text-green-700">Function Response:</strong>
            <pre className="whitespace-pre-wrap text-xs bg-green-100 p-2 rounded-md mt-1">
              {JSON.stringify(part.functionResponse.response, null, 2)}
            </pre>
          </div>
        )}
        {part.thought && (
          <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200 border-l-4 border-l-yellow-500 shadow-sm">
            <strong className="text-yellow-700">Thought:</strong> <p className="mt-1">{part.thought.reasoning}</p>
          </div>
        )}
      </div>
    ));
  };

  return (
    <ScrollArea className="h-full p-4">
      <h1 className="text-2xl font-bold mb-4">State Explorer for Client ID: {clientId || 'N/A'}</h1>
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}

      <Tabs defaultValue="state" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-muted p-1 rounded-md mb-4">
          <TabsTrigger value="state" className="data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground transition-all duration-200">State</TabsTrigger>
          <TabsTrigger value="events" className="data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground transition-all duration-200">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="state" className="mt-4">
          {stateData ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(stateData).map(([key, value]) => (
                <Card key={key} className="border border-border shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="capitalize text-lg font-semibold">{key.replace(/_/g, ' ')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {value !== null && typeof value !== 'undefined' ? (
                      typeof value === 'string' ? (
                        <pre className="whitespace-pre-wrap text-sm bg-muted p-2 rounded-md overflow-auto max-h-48 border border-gray-200">
                          {value}
                        </pre>
                      ) : (
                        <pre className="whitespace-pre-wrap text-sm bg-muted p-2 rounded-md overflow-auto max-h-48 border border-gray-200">
                          {JSON.stringify(value, null, 2)}
                        </pre>
                      )
                    ) : (
                      <pre className="whitespace-pre-wrap text-sm bg-muted p-2 rounded-md overflow-auto max-h-48 border border-gray-200">
                        N/A
                      </pre>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            !error && <p className="text-center text-gray-500">Loading state data...</p>
          )}
        </TabsContent>

        <TabsContent value="events" className="mt-4">
          {eventsData.length > 0 ? (
            <Accordion type="single" collapsible className="w-full space-y-2">
              {eventsData.map((event, index) => (
                <AccordionItem key={event.id || index} value={`item-${index}`} className="border rounded-md shadow-sm bg-card text-card-foreground">
                  <AccordionTrigger className="p-4 hover:bg-muted-foreground/5 transition-colors duration-200">
                    <div className="flex flex-col items-start text-left">
                      <span className="font-semibold text-base">Author: <span className="text-primary">{event.author}</span></span>
                      <span className="text-sm text-gray-600 mt-1">
                        Timestamp: {new Date(event.timestamp * 1000).toLocaleString()}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="border-t border-border bg-background p-4">
                    <Card className="border-none shadow-none">
                      <CardContent className="p-0">
                        {renderContent(event.content)}
                      </CardContent>
                    </Card>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p className="text-center text-gray-500">No event data available.</p>
          )}
        </TabsContent>
      </Tabs>
    </ScrollArea>
  );
};

export default StateExplorer;
