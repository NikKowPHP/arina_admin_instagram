import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface WebSocketContextProps {
  children: React.ReactNode;
}

interface WebSocketContextType {
  socket: Socket | null;
  triggerUpdated: (triggerId: string) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<WebSocketContextProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketIo = io('/api/ws/dashboard');

    socketIo.on('connect', () => {
      console.log('WebSocket connected');
    });

    socketIo.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, []);

  const triggerUpdated = (triggerId: string) => {
    if (socket) {
      socket.emit('trigger_updated', { triggerId });
    }
  };

  return (
    <WebSocketContext.Provider value={{ socket, triggerUpdated }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};