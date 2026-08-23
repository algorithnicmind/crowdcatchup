/**
 * CrowdShield Frontend API Client
 * Enforces HTTPS / Secure protocols across all environments.
 * Prevents Mixed Content blocking in modern browsers and PWA service workers.
 */

export function getApiBaseUrl(): string {
  let url = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:8000/api/v1';

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

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
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
      throw new Error(errorMessage);
    }
    return response.json();
  } catch (error) {
    // Propagate error to caller for fallback handling
    throw error;
  }
}
