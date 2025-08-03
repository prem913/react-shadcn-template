import React from 'react';
import { useAppStore } from './store/useAppStore';
import { useSocket } from './hooks/useSocket';
import ChatWindow from './components/chat/ChatWindow';
import ChatInput from './components/chat/ChatInput';
import { Badge } from './components/ui/badge';
import { cn } from './lib/utils';

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
      <ChatWindow />
      <ChatInput />
    </div>
  );
}

export default App;
