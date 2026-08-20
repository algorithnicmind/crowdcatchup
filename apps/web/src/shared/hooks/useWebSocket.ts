import { useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { useAuth } from '@clerk/nextjs';

export type WebSocketEvent = 
  | 'CROWD_STATE_UPDATE'
  | 'RISK_UPDATE'
  | 'RECOMMENDATION_ALERT'
  | 'SECURITY_TASK'
  | 'SOURCE_HEALTH'
  | 'CITIZEN_ALERT';

export function useWebSocket(eventId: string) {
  const { role } = useAuthStore();
  const { getToken, userId } = useAuth();
  const ws = useRef<WebSocket | null>(null);
  const retryCount = useRef(0);
  
  // A dictionary to store callbacks for each event type
  const callbacks = useRef<Record<string, ((payload: unknown) => void)[]>>({});

  // Forward declaration via ref to break circular dependency in useCallback
  const connectRef = useRef<(() => void) | null>(null);

  const connect = useCallback(async () => {
    if (!eventId || !role || !userId) return;

    try {
      // Prevent Clerk offline error by checking connection state first
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        console.warn('[WS] Browser is offline, skipping connection.');
        return;
      }

      const token = await getToken();
      if (!token) return;

      // Use ws:// localhost for development
      const wsUrl = `ws://localhost:8000/ws?token=${token}&event_id=${eventId}&role=${role}&user_id=${userId}`;
      
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log(`[WS] Connected to event ${eventId} as ${role}`);
        retryCount.current = 0;
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
        
        // Only retry up to 5 times to prevent console spam if backend is completely down
        if (retryCount.current < 5) {
          retryCount.current += 1;
          const delay = Math.min(5000 * retryCount.current, 30000);
          console.log(`[WS] Attempting to reconnect in ${delay}ms (Attempt ${retryCount.current}/5)`);
          
          setTimeout(() => {
            if (ws.current?.readyState === WebSocket.CLOSED || !ws.current) {
              if (connectRef.current) connectRef.current();
            }
          }, delay);
        } else {
          console.warn('[WS] Max reconnection attempts reached. Please ensure the Python backend is running on port 8000.');
        }
      };
    } catch (error) {
      console.error("[WS] Failed to connect", error);
    }
  }, [eventId, role, userId, getToken]);

  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  const disconnect = useCallback(() => {
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
  }, []);

  const subscribe = useCallback((eventType: WebSocketEvent, callback: (payload: unknown) => void) => {
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

    const handleOnline = () => {
      console.log('[WS] Network reconnected. Re-establishing WebSocket...');
      connect();
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
    }

    return () => {
      disconnect();
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
      }
    };
  }, [connect, disconnect]);

  return { subscribe, disconnect };
}
