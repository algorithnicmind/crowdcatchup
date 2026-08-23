/**
 * @deprecated This file is unused. The primary WebSocket implementation is
 * useWebSocket hook in shared/hooks/useWebSocket.ts.
 * Kept for reference only. Remove when confirmed no external consumers.
 */

import { getWsBaseUrl } from './api-client';

type MessageHandler = (data: unknown) => void;

class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private handlers: Map<string, Set<MessageHandler>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private isConnecting = false;

  constructor() {
    this.url = getWsBaseUrl();
  }

  connect(token?: string) {
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) return;
    
    this.isConnecting = true;
    const connectUrl = token ? `${this.url}?token=${token}` : this.url;
    
    this.ws = new WebSocket(connectUrl);

    this.ws.onopen = () => {
      this.isConnecting = false;
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        const eventName = payload.type || payload.event;
        const data = payload.data || payload.payload || payload;
        
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
      this.handleReconnect(token);
    };

    this.ws.onerror = () => {
      this.isConnecting = false;
    };
  }

  private handleReconnect(token?: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const timeout = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);
      setTimeout(() => this.connect(token), timeout);
    }
  }

  subscribe(eventName: string, handler: MessageHandler) {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, new Set());
    }
    this.handlers.get(eventName)!.add(handler);

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
