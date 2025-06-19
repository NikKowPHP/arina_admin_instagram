import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Trigger } from '@/types/database';

interface WebSocketContextType {
  triggers: Trigger[];
  refreshTriggers: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8082');

    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'trigger_update') {
        setTriggers(data.data.triggers);
      }
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  const refreshTriggers = () => {
    if (ws) {
      ws.send(JSON.stringify({ type: 'request_triggers' }));
    }
  };

  return (
    <WebSocketContext.Provider value={{ triggers, refreshTriggers }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};