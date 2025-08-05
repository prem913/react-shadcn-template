import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, TriangleAlert } from 'lucide-react'; // Import icons

interface StateViewProps {
  stateData: any;
  error: string | null;
  isLoading: boolean; // Added isLoading prop
}

const StateView: React.FC<StateViewProps> = ({ stateData, error, isLoading }) => {
  return (
    <ScrollArea className="h-full">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-full text-black">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-lg">Summoning the state data from the deep...</p>
        </div>
      ) : error ? (
        <div className="flex items-center space-x-2 text-destructive justify-center h-full">
          <TriangleAlert className="h-5 w-5" />
          <span className="text-lg">Error: {error}</span>
        </div>
      ) : stateData ? (
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
        <p className="text-center text-black h-full flex items-center justify-center text-lg">No state data available.</p>
      )}
    </ScrollArea>
  );
};

export default StateView;
