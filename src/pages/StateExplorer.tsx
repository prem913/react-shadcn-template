import React, { useState, useEffect } from 'react';
import { getState } from '../lib/api';
import StateView from '../components/StateView';

const StateExplorer: React.FC = () => {
  const [stateData, setStateData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Added isLoading state
  const [_, setClientId] = useState<string | null>(null);

  useEffect(() => {
    const storedClientId = localStorage.getItem('clientId');
    if (storedClientId) {
      setClientId(storedClientId);
      getState(storedClientId)
        .then(data => {
          setStateData(data.state);
        })
        .catch(err => {
          setError(err.message);
        })
        .finally(() => {
          setIsLoading(false); // Set loading to false after fetch completes
        });
    } else {
      setError('No client ID found in local storage.');
      setIsLoading(false); // Also set loading to false if no client ID
    }
  }, []);

  return (
    <div className="h-full p-4">
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}
      <h2 className="text-2xl font-bold mb-4">Application State</h2>
      <StateView stateData={stateData} error={error} isLoading={isLoading} /> {/* Pass isLoading */}
    </div>
  );
};

export default StateExplorer;
