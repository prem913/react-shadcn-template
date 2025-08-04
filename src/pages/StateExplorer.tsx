import React, { useState, useEffect } from 'react';
import { getState } from '../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ScrollArea } from '../components/ui/scroll-area';

const StateExplorer: React.FC = () => {
  const [stateData, setStateData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);

  useEffect(() => {
    const storedClientId = localStorage.getItem('clientId');
    if (storedClientId) {
      setClientId(storedClientId);
      getState(storedClientId)
        .then(data => {
          setStateData(data.state); // Access the 'state' object directly
        })
        .catch(err => {
          setError(err.message);
        });
    } else {
      setError('No client ID found in local storage.');
    }
  }, []);

  return (
    <ScrollArea className="h-full p-4">
      <h1 className="text-2xl font-bold mb-4">State Explorer for Client ID: {clientId || 'N/A'}</h1>
      {error && <p className="text-red-500">Error: {error}</p>}
      {stateData ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(stateData).map(([key, value]) => (
            <Card key={key}>
              <CardHeader>
                <CardTitle className="capitalize">{key.replace(/_/g, ' ')}</CardTitle>
              </CardHeader>
              <CardContent>
                {value !== null && typeof value !== 'undefined' ? (
                  typeof value === 'string' ? (
                    <pre className="whitespace-pre-wrap text-sm bg-muted p-2 rounded-md overflow-auto max-h-48">
                      {value}
                    </pre>
                  ) : (
                    <pre className="whitespace-pre-wrap text-sm bg-muted p-2 rounded-md overflow-auto max-h-48">
                      {JSON.stringify(value, null, 2)}
                    </pre>
                  )
                ) : (
                  <pre className="whitespace-pre-wrap text-sm bg-muted p-2 rounded-md overflow-auto max-h-48">
                    N/A
                  </pre>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        !error && <p>Loading state data...</p>
      )}
    </ScrollArea>
  );
};

export default StateExplorer;
