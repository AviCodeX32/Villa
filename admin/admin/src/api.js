const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('saivilla_admin_token');
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  return response.json();
};