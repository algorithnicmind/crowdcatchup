type MessageHandler = (data: unknown) => void;

class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private handlers: Map<string, Set<MessageHandler>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private isConnecting = false;

  constructor() {
    // Determine WS URL based on current host or env var
    const wsBaseUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/ws";
    this.url = wsBaseUrl;
  }

  connect(token?: string) {
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) return;
    
    this.isConnecting = true;
    
    // Auth token can be passed in query string for WS
    const connectUrl = token ? `${this.url}?token=${token}` : this.url;
    
    this.ws = new WebSocket(connectUrl);

    this.ws.onopen = () => {
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      console.log("[WebSocket] Connected");
    };

    this.ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        const { event: eventName, data } = payload;
        
        const eventHandlers = this.handlers.get(eventName);
        if (eventHandlers) {
          eventHandlers.forEach(handler => handler(data));
        }
      } catch (err) {
        console.error("[WebSocket] Failed to parse message", err);
      }
    };

    this.ws.onclose = () => {
      this.isConnecting = false;
      console.log("[WebSocket] Disconnected");
      this.handleReconnect(token);
    };

    this.ws.onerror = (error) => {
      console.error("[WebSocket] Error:", error);
    };
  }

  private handleReconnect(token?: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const timeout = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);
      console.log(`[WebSocket] Reconnecting in ${timeout}ms...`);
      setTimeout(() => this.connect(token), timeout);
    }
  }

  subscribe(eventName: string, handler: MessageHandler) {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, new Set());
    }
    this.handlers.get(eventName)!.add(handler);

    // Return unsubscribe function
    return () => {
      const eventHandlers = this.handlers.get(eventName);
      if (eventHandlers) {
        eventHandlers.delete(handler);
      }
    };
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const wsClient = new WebSocketClient();
