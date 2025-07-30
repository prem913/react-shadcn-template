import React, { useEffect } from 'react';
import { useAppStore } from '@/store';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { ComputerDesktopIcon, ChartBarIcon as HeadphonesIcon, ChartBarIcon, ClipboardDocumentListIcon, BuildingOfficeIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface IconMap {
  [key: string]: React.ElementType; // Use React.ElementType for Heroicon components
}

const icons: IconMap = {
  Laptop: ComputerDesktopIcon,
  Headphones: HeadphonesIcon,
  BarChart3: ChartBarIcon,
  ClipboardList: ClipboardDocumentListIcon,
  Warehouse: BuildingOfficeIcon,
  Gem: SparklesIcon, // Fallback icon
};

export function ApplicationsSidebar() {
  const { applications, isLoadingApplications, fetchApplications, selectedApplication, setSelectedApplication } = useAppStore();

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return (
    <div className="h-full p-4 border-r bg-gray-50 dark:bg-gray-900 overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Applications</h2>
      <div className="space-y-2">
        {isLoadingApplications ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-md bg-gray-200 dark:bg-gray-700" />
          ))
        ) : (
          applications.map((app) => {
            const IconComponent = icons[app.icon] || SparklesIcon;
            return (
              <div
                key={app.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-md cursor-pointer transition-all duration-200 ease-in-out",
                  "hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900 dark:hover:text-blue-300",
                  selectedApplication?.id === app.id
                    ? "bg-blue-500 text-white dark:bg-blue-700 dark:text-white shadow-md"
                    : "bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                )}
                onClick={() => setSelectedApplication(app)}
              >
                <IconComponent className="w-5 h-5" />
                <span className="font-medium text-sm md:text-base">{app.name}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
