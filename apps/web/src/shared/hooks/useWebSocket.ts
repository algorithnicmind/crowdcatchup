import { useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from '@/stores/auth-store';

export type WebSocketEvent = 
  | 'CROWD_STATE_UPDATE'
  | 'RISK_UPDATE'
  | 'RECOMMENDATION_ALERT'
  | 'SECURITY_TASK'
  | 'SOURCE_HEALTH'
  | 'CITIZEN_ALERT';

export function useWebSocket(eventId: string) {
  const { token, role } = useAuthStore();
  const ws = useRef<WebSocket | null>(null);
  
  // A dictionary to store callbacks for each event type
  const callbacks = useRef<Record<string, ((payload: any) => void)[]>>({});

  // Forward declaration via ref to break circular dependency in useCallback
  const connectRef = useRef<() => void>();

  const connect = useCallback(() => {
    if (!token || !eventId || !role) return;

    // Use ws:// localhost for development
    const wsUrl = `ws://localhost:8000/ws?token=${token}&event_id=${eventId}&role=${role}&user_id=user123`;
    
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log(`[WS] Connected to event ${eventId} as ${role}`);
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const eventType = data.type;
        
        if (eventType && callbacks.current[eventType]) {
          callbacks.current[eventType].forEach((cb) => cb(data));
        }
      } catch (err) {
        console.error('[WS] Failed to parse message', err);
      }
    };

    ws.current.onclose = () => {
      console.log(`[WS] Disconnected from event ${eventId}`);
      setTimeout(() => {
        if (ws.current?.readyState === WebSocket.CLOSED) {
          if (connectRef.current) connectRef.current();
        }
      }, 5000);
    };
  }, [eventId, token, role]);

  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  const disconnect = useCallback(() => {
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
  }, []);

  const subscribe = useCallback((eventType: WebSocketEvent, callback: (payload: any) => void) => {
    if (!callbacks.current[eventType]) {
      callbacks.current[eventType] = [];
    }
    callbacks.current[eventType].push(callback);

    // Return an unsubscribe function
    return () => {
      callbacks.current[eventType] = callbacks.current[eventType].filter((cb) => cb !== callback);
    };
  }, []);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return { subscribe, disconnect };
}
