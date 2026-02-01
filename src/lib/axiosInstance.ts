import axios from "axios";
// const baseURL = import.meta.env.VITE_API_URL;

const api = axios.create({
  // baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "content-type": "application/json",
    "ngrok-skip-browser-warning": "true", // only for development with ngrok tunnels
    "x-internal-access": import.meta.env.VITE_INTERNAL_ACCESS_KEY,
  },
});

// Refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axios.post(`/api/auth/ud`, {}, { withCredentials: true });

        return api(originalRequest);
      } catch {
        window.location.href = "/";
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

export default api;

export interface ApiResponse<T> {
  data: T;
  message: string;
}
