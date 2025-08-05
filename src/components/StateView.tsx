import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface StateViewProps {
  stateData: any;
  error: string | null;
}

const StateView: React.FC<StateViewProps> = ({ stateData, error }) => {
  return (
    <ScrollArea className="h-full">
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
        !error && <p className="text-center text-black">Loading state data...</p>
      )}
    </ScrollArea>
  );
};

export default StateView;
