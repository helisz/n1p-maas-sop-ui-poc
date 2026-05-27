import { ofetch, type FetchContext, type FetchResponse, type ResponseType } from 'ofetch';
import router from '@/router';
// [AI_START TIMESTAMP=2025-06-20 10:30:00]
import { useAuthStore } from '@/stores/auth';
// [AI_END LINES=2 TIMESTAMP=2025-06-20 10:30:00]

// [AI_START TIMESTAMP=2025-06-20 10:30:00]
export interface ApiResponseSchema<T> {
  code: number;
  message: string;
  data: T | null;
}
// [AI_END LINES=5 TIMESTAMP=2025-06-20 10:30:00]

export type ApiErrorSchema = ApiResponseSchema<undefined>;

function handleError<T>(response: FetchResponse<ApiResponseSchema<T>> & FetchResponse<ResponseType>) {
  if (!response._data) {
    console.error('Request timeout, no server response!');
    return;
  }

  const { code, message } = response._data;

  const httpErrorHandleMap: { [key: number]: () => void } = {
    302: () => {
      console.error('302 Found - Redirect');
      const location = response.headers.get('Location');
      if (location) router.push(location);
    },
    404: () => console.error('404 Not Found'),
    500: () => console.error('500 Internal Server Error'),
    503: () => console.error('503 Service Unavailable'),
    403: () => console.error('403 Forbidden'),
    401: () => {
      console.error('401 Unauthorized');
    },
  };

  const errorHandler = httpErrorHandleMap[response.status];
  if (errorHandler) errorHandler();
  else console.error(message || `Error code: ${code}`);
}

function onRequestError(context: FetchContext<any, ResponseType> & { error: Error }) {
  console.error(`Request error: ${context.error}`);
}

function onResponseError(context: FetchContext<any, ResponseType> & { response: FetchResponse<ResponseType> }) {
  handleError(context.response);
  return Promise.reject(context.response._data ?? null);
}

export const apiFetch = ofetch.create({
  baseURL: import.meta.env.VITE_API_GATEWAY,
  // [AI_START TIMESTAMP=2025-06-20 10:30:00]
  onRequest({ options }) {
    options.credentials = 'include';
    options.headers = new Headers(options.headers);
    const { token } = useAuthStore();
    if (token) {
      options.headers.set('Authorization', `Bearer ${token}`);
    }
  },
  // [AI_END LINES=10 TIMESTAMP=2025-06-20 10:30:00]
  onRequestError,
  // [AI_START TIMESTAMP=2025-06-20 10:30:00]
  onResponse({ response }) {
    if (response.status !== 200) {
      handleError(response);
      return Promise.reject(response._data);
    }
    if (response._data && response._data.code === 200) {
      response._data = response._data.data;
    } else {
      handleError(response);
      return Promise.reject(response._data ?? null);
    }
  },
  // [AI_END LINES=13 TIMESTAMP=2025-06-20 10:30:00]
  onResponseError,
});

export async function streamFetch(url: string, options?: any): Promise<ReadableStream<Uint8Array>> {
  const fetchOptions: RequestInit = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    method: options?.method || 'GET',
    body: options?.body ? JSON.stringify(options.body) : undefined,
  };

  const response = await fetch(url, fetchOptions);
  if (!response.ok) throw new Error(`Stream fetch failed: ${response.status} ${response.statusText}`);
  if (!response.body) throw new Error('Stream fetch failed: Response body is null');
  return response.body;
}
