import React, { useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { cn } from '../../lib/utils';

const ApplicationList: React.FC = () => {
  const {
    applications,
    selectedApplication,
    setSelectedApplication,
    isLoadingApplications,
    fetchApplications,
  } = useAppStore();

  useEffect(() => {
    if (applications.length === 0 && !isLoadingApplications) {
      fetchApplications();
    }
  }, [applications.length, isLoadingApplications, fetchApplications]);

  if (isLoadingApplications) {
    return (
      <div className="p-2 space-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col p-2 space-y-1">
      {applications.map((app) => (
        <Button
          key={app.id}
          variant={selectedApplication?.id === app.id ? 'secondary' : 'ghost'}
          className={cn(
            'w-full justify-start',
            selectedApplication?.id === app.id && 'bg-muted'
          )}
          onClick={() => setSelectedApplication(app)}
        >
          <span className="mr-2 text-lg">{app.icon}</span>
          {app.name}
        </Button>
      ))}
    </div>
  );
};

export default ApplicationList;
