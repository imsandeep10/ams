import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/ud`,
          {},
          { withCredentials: true }
        );

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