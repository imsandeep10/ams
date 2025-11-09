import axios from 'axios';

// Get initial token from localStorage
const token = localStorage.getItem('accessToken');

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
  timeout: 10000,
  headers: {
    Authorization: token ? `Bearer ${token}` : undefined,
  }
});

interface FailedRequestPromise {
  resolve: (token: string) => void;
  reject: (error: any) => void;
}

let isRefreshing: boolean = false;
let failedQueue: FailedRequestPromise[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
      refreshToken: refreshToken
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data;
    
    // Update tokens in localStorage
    localStorage.setItem('accessToken', accessToken);
    if (newRefreshToken) {
      localStorage.setItem('refreshToken', newRefreshToken);
    }

    // Update default Authorization header
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

    return accessToken;
  } catch (error) {
    // Clear tokens and redirect to the app's auth entry (root) instead of to
    // '/login' which isn't a defined route in the router. This prevents
    // React Router's default error boundary from showing a 404.
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    delete api.defaults.headers.common['Authorization'];
    window.location.href = '/';
    throw error;
  }
};

// Request interceptor - dynamically adds token
api.interceptors.request.use(
  (config) => {
    // Get fresh token from localStorage on each request
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
        
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - runs after every response
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    

    // Handle 401 unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue the request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        processQueue(null, newToken);
        
        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        
        // Clear auth state in your store when refresh fails
        try {
          const { getAuthStore } = await import('@/lib/stores/AuthStore');
          getAuthStore().logout();
        } catch (importError) {
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other error cases
    if (error.response?.status === 403) {
    }

    return Promise.reject(error);
  }
);

export default api;