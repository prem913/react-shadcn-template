import React, { useState, useEffect } from 'react';
import { getState } from '../lib/api';
import EventsView from '../components/EventsView';

const EventsPage: React.FC = () => {
  const [eventsData, setEventsData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Added isLoading state
  const [_, setClientId] = useState<string | null>(null);

  useEffect(() => {
    const storedClientId = localStorage.getItem('clientId');
    if (storedClientId) {
      setClientId(storedClientId);
      getState(storedClientId)
        .then(data => {
          // Sort events by timestamp in descending order (latest first)
          const sortedEvents = (data.events || []).sort((a: any, b: any) => {
            // Assuming timestamp is a number (Unix epoch) or can be converted to one
            return b.timestamp - a.timestamp;
          });
          setEventsData(sortedEvents);
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
      <h2 className="text-2xl font-bold mb-4">Conversation Events</h2>
      <EventsView eventsData={eventsData} error={error} isLoading={isLoading} /> {/* Pass isLoading */}
    </div>
  );
};

export default EventsPage;
