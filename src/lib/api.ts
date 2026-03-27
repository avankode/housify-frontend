import { API_BASE_BACKEND, getCookie } from '@/src/app/utils';

export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_BACKEND}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': typeof document !== 'undefined' ? getCookie('csrftoken') || '' : '',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, defaultOptions);
  
  if (response.status === 401) {
    // Handle unauthorized globally if needed
  }

  return response;
};
