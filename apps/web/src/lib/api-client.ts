let API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
if (!API_BASE_URL.endsWith('/api/v1')) {
  API_BASE_URL = API_BASE_URL.replace(/\/$/, '') + '/api/v1';
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Dynamically import store to avoid Next.js SSR issues if needed, but Zustand can be imported directly
  const { useAuthStore } = await import('@/stores/auth-store');
  const token = useAuthStore.getState().token;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || 'API Request Failed');
    }
    return response.json();
  } catch (error) {
    // Only throw the error to be caught by the caller's fallback logic.
    // Avoid console.error here because Next.js dev mode intercepts it and shows a red error overlay.
    throw error;
  }
}
