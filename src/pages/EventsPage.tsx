import React, { useState, useEffect } from 'react';
import { getState } from '../lib/api';
import EventsView from '../components/EventsView';

const EventsPage: React.FC = () => {
  const [eventsData, setEventsData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [_, setClientId] = useState<string | null>(null);

  useEffect(() => {
    const storedClientId = localStorage.getItem('clientId');
    if (storedClientId) {
      setClientId(storedClientId);
      getState(storedClientId)
        .then(data => {
          setEventsData(data.events || []);
        })
        .catch(err => {
          setError(err.message);
        });
    } else {
      setError('No client ID found in local storage.');
    }
  }, []);

  return (
    <div className="h-full p-4">
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}
      <h2 className="text-2xl font-bold mb-4">Conversation Events</h2>
      <EventsView eventsData={eventsData} error={error} />
    </div>
  );
};

export default EventsPage;
