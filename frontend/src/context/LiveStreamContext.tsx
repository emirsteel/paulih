import React, { createContext, useContext, useState } from 'react';

interface LiveStreamContextProps {
  isLive: boolean;
  stream: MediaStream | null;
  startLive: (stream: MediaStream) => void;
  stopLive: () => void;
}

const LiveStreamContext = createContext<LiveStreamContextProps | null>(null);

export const LiveStreamProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [isLive, setIsLive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  
// LiveStreamContext.tsx
const startLive = (stream: MediaStream) => {
    console.log("Starting live stream..."); // Debug log
    setIsLive(true);
    setStream(stream);
  };
  
  const stopLive = () => {
    console.log("Stopping live stream..."); // Debug log
    setIsLive(false);
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setStream(null);
  };
  
  

  return (
    <LiveStreamContext.Provider value={{ isLive, stream, startLive, stopLive }}>
      {children}
    </LiveStreamContext.Provider>
  );
};

export const useLiveStream = () => {
  const context = useContext(LiveStreamContext);
  if (!context) {
    throw new Error('useLiveStream must be used within a LiveStreamProvider');
  }
  return context;
};
