import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "content-type": "application/json",
    "X-Internal-Access": `${import.meta.env.VITE_INTERNAL_ACCESS_KEY}`,
  },
});

interface FailedRequestPromise {
  resolve: (token: string) => void;
  reject: (error: any) => void;
}

let isRefreshing: boolean = false;
let failedQueue: FailedRequestPromise[] = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// const refreshAccessToken = async () => {
//   try {
//     const refreshToken = localStorage.getItem("refreshToken");
//     if (!refreshToken) {
//       throw new Error("No refresh token available");
//     }

//     const response = await axios.post(
//       `${import.meta.env.VITE_API_URL}/auth/ud`,
//       {
//         refreshToken: refreshToken,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const { accessToken, refreshToken: newRefreshToken } = response.data;

//     // Update tokens in localStorage
//     localStorage.setItem("accessToken", accessToken);
//     if (newRefreshToken) {
//       localStorage.setItem("refreshToken", newRefreshToken);
//     }

//     // Update default Authorization header
//     api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

//     return accessToken;
//   } catch (error) {
//     // Clear tokens and redirect to the app's auth entry (root) instead of to
//     // '/login' which isn't a defined route in the router. This prevents
//     // React Router's default error boundary from showing a 404.
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("refreshToken");
//     delete api.defaults.headers.common["Authorization"];
//     window.location.href = "/";
//     throw error;
//   }
// };

// Request interceptor - dynamically adds token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get fresh token from localStorage on each request
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (token && config.headers) {
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
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue the request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers && token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post("/audth/ud", {
          withCredentials: true,
        });

        const { accessToken } = response.data;

        if (typeof window !== "undefined" && accessToken) {
          localStorage.setItem("token", accessToken);
        }

        if (originalRequest.headers && accessToken) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        processQueue(null, accessToken);

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);

        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          window.location.href = "/";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other errors
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as any;
      const fallbackMessage =
        (typeof data === "string" && data) ||
        data?.message ||
        error.message ||
        "Unknown error";

      switch (status) {
        case 403:
          console.error("Access forbidden:", fallbackMessage);
          break;
        case 404:
          console.error("Resource not found:", fallbackMessage);
          break;
        case 500:
          console.error("Server error:", fallbackMessage);
          break;
        default:
          console.error(`Error (status ${status}):`, fallbackMessage);
      }
    } else if (error.request) {
      console.error("Network or CORS error:", error.message);
    } else {
      console.error("Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
