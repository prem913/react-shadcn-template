import React, { useState, useEffect } from 'react';
import { getState } from '../lib/api';

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
          setStateData(data);
        })
        .catch(err => {
          setError(err.message);
        });
    } else {
      setError('No client ID found in local storage.');
    }
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">State Explorer for Client ID: {clientId || 'N/A'}</h1>
      {error && <p className="text-red-500">Error: {error}</p>}
      {stateData ? (
        <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
          {JSON.stringify(stateData, null, 2)}
        </pre>
      ) : (
        !error && <p>Loading state data...</p>
      )}
    </div>
  );
};

export default StateExplorer;
