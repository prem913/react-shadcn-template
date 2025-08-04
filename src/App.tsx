import React from 'react';
import { useAppStore } from './store/useAppStore';
import { useSocket } from './hooks/useSocket';
import ChatWindow from './components/chat/ChatWindow';
import ChatInput from './components/chat/ChatInput';
import { Badge } from './components/ui/badge';
import { cn } from './lib/utils';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import StateExplorer from './pages/StateExplorer';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs';

function App() {
  const {
    connectionStatus,
    clientId,
  } = useAppStore();

  // Initialize WebSocket connection
  useSocket();

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
    <Router>
      <div className="flex flex-col h-screen bg-background text-foreground">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-semibold">Chatbot</h2>
          <Badge
            variant={getConnectionBadgeVariant()}
            className={cn(connectionStatus === 'connecting' && 'animate-pulse')}
          >
            {getConnectionBadgeText()}
          </Badge>
        </div>

        <Tabs defaultValue="chat" className="w-full h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chat" asChild>
              <Link to="/">Chat</Link>
            </TabsTrigger>
            <TabsTrigger value="state-explorer" asChild>
              <Link to={`/state-explorer/${clientId || 'YOUR_CLIENT_ID'}`}>State Explorer</Link>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="chat" className="flex flex-col flex-grow h-full">
            <Routes>
              <Route path="/" element={
                <div className="flex flex-col h-full justify-between"> {/* Added justify-between here */}
                  <ChatWindow className="flex-grow" />
                  <ChatInput />
                </div>
              } />
            </Routes>
          </TabsContent>
          <TabsContent value="state-explorer" className="flex flex-col flex-grow">
            <Routes>
              <Route path="/state-explorer/:clientId" element={<StateExplorer />} />
            </Routes>
          </TabsContent>
        </Tabs>
      </div>
    </Router>
  );
}

export default App;
