import React, { useEffect } from 'react';
import { Sidebar, SidebarContent, SidebarHeader, SidebarProvider, SidebarTrigger, SidebarInset } from './components/ui/sidebar';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from './components/ui/resizable';
import { useAppStore } from './store/useAppStore';
import { useSocket } from './hooks/useSocket';
import ChatWindow from './components/chat/ChatWindow';
import ChatInput from './components/chat/ChatInput';
import { Badge } from './components/ui/badge';
import { cn } from './lib/utils';

function App() {
  const {
    connectionStatus,
    fetchApplications,
    selectedApplication,
  } = useAppStore();

  // Initialize WebSocket connection
  useSocket();

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const getConnectionBadgeVariant = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'default';
      case 'connecting':
        return 'secondary';
      case 'disconnected':
        return 'destructive';
      case 'error':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getConnectionBadgeText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'disconnected':
        return 'Disconnected';
      case 'error':
        return 'Connection Error';
      default:
        return 'Unknown';
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-screen items-stretch bg-background text-foreground"
      >
        <ResizablePanel defaultSize={20} minSize={15} maxSize={25}>
          <Sidebar className="h-full flex flex-col">
            <SidebarHeader className="flex items-center justify-between p-2">
              <h1 className="text-lg font-bold">ADK Runner</h1>
              <SidebarTrigger />
            </SidebarHeader>
            <SidebarContent />
          </Sidebar>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={80} minSize={50}>
          <SidebarInset className="flex flex-col h-screen bg-background text-foreground">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-xl font-semibold">
                {selectedApplication ? selectedApplication.name : 'Select an Application'}
              </h2>
              <Badge
                variant={getConnectionBadgeVariant()}
                className={cn(connectionStatus === 'connecting' && 'animate-pulse')}
              >
                {getConnectionBadgeText()}
              </Badge>
            </div>
            <ChatWindow />
            <ChatInput />
          </SidebarInset>
        </ResizablePanel>
      </ResizablePanelGroup>
    </SidebarProvider>
  );
}

export default App;
