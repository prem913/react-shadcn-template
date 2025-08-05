import { useAppStore } from './store/useAppStore';
import { useSocket } from './hooks/useSocket';
import ChatWindow from './components/chat/ChatWindow';
import ChatInput from './components/chat/ChatInput';
import { Badge } from './components/ui/badge';
import { cn } from './lib/utils';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StateExplorer from './pages/StateExplorer';
import FileExplorer from './components/FileExplorer';
import EventsPage from './pages/EventsPage'; // Import the new EventsPage
import { Sidebar } from './components/SideBar';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from './components/ui/resizable';
import { Button } from './components/ui/button';
import { useEffect } from 'react';

function App() {
  const { connectionStatus } = useAppStore();
  const { connectSocket } = useSocket();

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

  const handleReconnect = () => {
    connectSocket();
  };

  const sidebarNavItems = [
    {
      title: "Chat",
      href: "/",
    },
    {
      title: "State",
      href: "/state",
    },
    {
      title: "Files",
      href: "/files",
    },
    {
      title: "Events", // Uncommented and activated
      href: "/events",
    },
  ];

  useEffect(()=>{
    connectSocket()
  },[])

  return (
    <Router>
      <div className="flex flex-col h-screen bg-background text-foreground">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-semibold">Chatbot</h2>
          <div className="flex items-center space-x-2">
            {(connectionStatus === 'disconnected' || connectionStatus === 'error') && (
              <Button
                onClick={handleReconnect}
                variant="outline"
                size="sm"
              >
                Reconnect
              </Button>
            )}
            <Badge
              variant={getConnectionBadgeVariant()}
              className={cn(connectionStatus === 'connecting' && 'animate-pulse')}
            >
              {getConnectionBadgeText()}
            </Badge>
          </div>
        </div>

        <ResizablePanelGroup direction="horizontal" className="flex-grow">
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <Sidebar items={sidebarNavItems} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={80}>
            <div className="flex flex-col h-full">
              <Routes>
                <Route path="/" element={
                  <div className="flex flex-col h-full">
                    <ChatWindow className="flex-grow" />
                    <ChatInput />
                  </div>
                } />
                <Route path="/state" element={<StateExplorer />} />
                <Route path="/files" element={<FileExplorer />} />
                <Route path="/events" element={<EventsPage />} /> {/* Route to the new EventsPage */}
              </Routes>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </Router>
  );
}

export default App;
