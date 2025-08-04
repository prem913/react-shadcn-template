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

        <div className="flex flex-grow overflow-hidden"> {/* Main content area using flexbox */}
          {/* State Explorer - always on the left */}
          <div className="w-1/3 border-r border-border overflow-y-auto">
            <StateExplorer />
          </div>

          {/* Chat and other tabs - on the right */}
          <Tabs defaultValue="chat" className="w-2/3 flex flex-col">
            <TabsList className="grid w-full grid-cols-1"> {/* Only one tab now */}
              <TabsTrigger value="chat" asChild>
                <Link to="/">Chat</Link>
              </TabsTrigger>
              {/* Removed State Explorer tab trigger as it's now always visible */}
            </TabsList>
            <TabsContent value="chat" className="flex flex-col flex-grow h-full">
              <Routes>
                <Route path="/" element={
                  <div className="flex flex-col h-full"> 
                    <ChatWindow className="flex-grow" /> 
                    <ChatInput /> 
                  </div>
                } />
              </Routes>
            </TabsContent>
            {/* Removed State Explorer TabsContent */}
          </Tabs>
        </div>
      </div>
    </Router>
  );
}

export default App;
