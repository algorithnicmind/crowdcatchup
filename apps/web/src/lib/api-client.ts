/**
 * CrowdShield Frontend API Client
 * Enforces HTTPS / Secure protocols across all environments.
 * Prevents Mixed Content blocking in modern browsers and PWA service workers.
 */

export class ApiError extends Error {
  public code: string;
  public status: number;
  public details: Record<string, any>;

  constructor(message: string, code: string = 'UNKNOWN_ERROR', status: number = 500, details: Record<string, any> = {}) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export function getApiBaseUrl(): string {
  let url = process.env.NEXT_PUBLIC_API_URL || 'https://crowdcatchup.onrender.com/api/v1';

  // In browser, automatically upgrade http:// to https:// if the frontend is loaded over HTTPS
  if (typeof window !== 'undefined' && window.location.protocol === 'https:' && url.startsWith('http://')) {
    url = url.replace(/^http:\/\//, 'https://');
  }

  if (!url.endsWith('/api/v1')) {
    url = url.replace(/\/$/, '') + '/api/v1';
  }
  return url;
}

export function getWsBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_WS_URL) {
    return process.env.NEXT_PUBLIC_WS_URL;
  }
  const apiBase = getApiBaseUrl();
  // Automatically maps https:// -> wss:// and http:// -> ws://
  const wsUrl = apiBase.replace(/^http/, 'ws').replace(/\/api\/v1\/?$/, '/ws');
  return wsUrl;
}

// Global state for Demo Mode so created events actually appear in the UI
const MOCK_EVENTS = [
  { id: 'demo-evt-1', name: 'Tomorrowland Main Stage', location: 'Boom, Belgium', status: 'ACTIVE', start_time: new Date().toISOString(), owner_id: 'demo-user-3' },
  { id: 'demo-evt-2', name: 'Global Tech Summit 2026', location: 'San Francisco', status: 'UPCOMING', start_time: new Date().toISOString(), owner_id: 'demo-user-3' }
];

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${cleanEndpoint}`;
  
  // Dynamically import store to avoid Next.js SSR issues
  const { useAuthStore } = await import('@/stores/auth-store');
  const token = useAuthStore.getState().token;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  if (!token || token === 'demo-token' || token?.startsWith('mock_')) {
    // --- HACKATHON DEMO MODE INTERCEPTOR ---
    // Allow actual auth endpoints to hit the real backend so login works
    if (cleanEndpoint === '/auth/login' || cleanEndpoint === '/auth/register' || cleanEndpoint === '/auth/me') {
      // Do nothing, let it fall through to the real fetch below
    } else {
      if (cleanEndpoint === '/auth/users') {
        return [
        { id: 'demo-user-1', full_name: 'John Officer', email: 'police@test.com', phone_number: '+1-555-0101', role: 'POLICE' },
        { id: 'demo-user-2', full_name: 'Sarah Medic', email: 'medic@test.com', phone_number: '+1-555-0102', role: 'AUTHORITY' },
        { id: 'demo-user-3', full_name: 'Event Owner', email: 'owner@test.com', phone_number: '+1-555-0103', role: 'EVENT_OWNER' }
      ] as any;
    }
    if (cleanEndpoint === '/events') {
      if (options.method === 'POST') {
        const body = options.body ? JSON.parse(options.body as string) : {};
        const newEvent = {
          id: `demo-evt-${Date.now()}`,
          name: body.name || 'Custom Demo Event',
          location: 'Custom Location',
          status: 'UPCOMING',
          start_time: body.start_date || new Date().toISOString(),
          owner_id: 'demo-user-3',
          expected_attendance: body.expected_attendance || 0,
          max_capacity: body.max_capacity || 0
        };
        MOCK_EVENTS.push(newEvent);
        return { success: true, message: 'Event created successfully', id: newEvent.id } as any;
      }
      return [...MOCK_EVENTS] as any;
    }
    if (cleanEndpoint === '/zones') {
      return [
        { id: 'demo-zone-1', name: 'VIP Area', capacity: 500, current_occupancy: 450, risk_level: 'MEDIUM', event_id: 'demo-evt-1' },
        { id: 'demo-zone-2', name: 'General Admission', capacity: 10000, current_occupancy: 9500, risk_level: 'HIGH', event_id: 'demo-evt-1' }
      ] as any;
    }
    if (options.method === 'POST' || options.method === 'PUT' || options.method === 'PATCH' || options.method === 'DELETE') {
      return { success: true, message: 'Mock action successful' } as any;
    }
    return [] as any;
    }
  }

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Parse industrial standard JSON Error Envelope if available
      if (errorData.error && errorData.error.message) {
        throw new ApiError(
          errorData.error.message,
          errorData.error.code,
          response.status,
          errorData.error.details || {}
        );
      }

      // Fallback for legacy generic FastAPI validation errors
      let errorMessage = `API Request Failed with status ${response.status}`;
      if (errorData.detail) {
        if (Array.isArray(errorData.detail)) {
          errorMessage = errorData.detail.map((e: any) => e.msg).join(', ');
        } else if (typeof errorData.detail === 'string') {
          errorMessage = errorData.detail;
        }
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }
      throw new ApiError(errorMessage, 'LEGACY_ERROR', response.status);
    }
    return response.json();
  } catch (error) {
    // Propagate error to caller for fallback handling
    throw error;
  }
}
