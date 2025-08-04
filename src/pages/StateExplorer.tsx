import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getState } from '../lib/api';

const StateExplorer: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const [stateData, setStateData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (clientId) {
      getState(clientId)
        .then(data => {
          setStateData(data);
        })
        .catch(err => {
          setError(err.message);
        });
    }
  }, [clientId]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">State Explorer for Client ID: {clientId}</h1>
      {error && <p className="text-red-500">Error: {error}</p>}
      {stateData ? (
        <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
          {JSON.stringify(stateData, null, 2)}
        </pre>
      ) : (
        <p>Loading state data...</p>
      )}
    </div>
  );
};

export default StateExplorer;
