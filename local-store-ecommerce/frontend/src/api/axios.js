import axios from 'axios';

const SESSION_STORAGE_KEY = 'local_store_session_id';

export const getSessionId = () => {
  let sessionId = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  }
  return sessionId;
};

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: inject x-session-id
api.interceptors.request.use((config) => {
  config.headers['x-session-id'] = getSessionId();
  return config;
});

// Response interceptor: capture x-session-id if server responds with one
api.interceptors.response.use(
  (response) => {
    const serverSessionId = response.headers['x-session-id'];
    if (serverSessionId && serverSessionId !== localStorage.getItem(SESSION_STORAGE_KEY)) {
      localStorage.setItem(SESSION_STORAGE_KEY, serverSessionId);
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
