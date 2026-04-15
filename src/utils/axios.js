import axios from "axios";
import { reconnectSocket } from "../socket/socket";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "x-api-key": import.meta.env.VITE_API_KEY,
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Handle FormData automatically
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isLogoutEndpoint = originalRequest?.url?.includes("auth/logout");
    const isLoginEndpoint = originalRequest?.url?.includes("auth/login");
    const isRefreshEndpoint =
      originalRequest?.url?.includes("auth/refresh-token");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isLogoutEndpoint &&
      !isLoginEndpoint &&
      !isRefreshEndpoint
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = sessionStorage.getItem("refreshToken");
      const accessToken = sessionStorage.getItem("accessToken");

      if (!refreshToken) {
        sessionStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}auth/refresh-token`,
          { refreshToken },
          {
            headers: {
              "Content-Type": "application/json",
              "x-api-key": import.meta.env.VITE_API_KEY,
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        if (!response.data || !response.data.data) {
          console.error("❌ Unexpected response structure:", response);
          throw new Error("Invalid refresh token response");
        }

        const newAccessToken = response.data.data.accessToken;
        const newRefreshToken = response.data.data.refreshToken;

        if (!newAccessToken || !newRefreshToken) {
          throw new Error("Tokens missing in refresh response");
        }

        // Save new tokens
        sessionStorage.setItem("accessToken", newAccessToken);
        sessionStorage.setItem("refreshToken", newRefreshToken);

        // reconnect socket with new token
        reconnectSocket(newAccessToken);

        api.defaults.headers.common["Authorization"] =
          `Bearer ${newAccessToken}`;

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        sessionStorage.clear();
        window.location.href = "/login";

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
