import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);

        // Don't send Authorization headers to auth endpoints.
        const authEndpoints = [
            "/accounts/token/",
            "/accounts/token/refresh/",
        ];

        if (authEndpoints.includes(config.url)) {
            delete config.headers.Authorization;
            return config;
        }

        if (token && token !== "undefined") {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            delete config.headers.Authorization;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        // Don't try refreshing after failed auth requests.
        const authEndpoints = [
            "/accounts/token/",
            "/accounts/token/refresh/",
        ];

        if (authEndpoints.includes(originalRequest?.url)) {
            return Promise.reject(error);
        }

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem(REFRESH_TOKEN);

            if (!refreshToken || refreshToken === "undefined") {
                localStorage.removeItem(ACCESS_TOKEN);
                localStorage.removeItem(REFRESH_TOKEN);

                window.location.href = "/login";
                return Promise.reject(error);
            }

            try {
                const res = await api.post("/accounts/token/refresh/", {
                    refresh: refreshToken,
                });

                const newAccessToken = res.data.access;

                if (!newAccessToken || newAccessToken === "undefined") {
                    throw new Error("Invalid access token returned.");
                }

                localStorage.setItem(ACCESS_TOKEN, newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return api(originalRequest);
            } catch (err) {
                localStorage.removeItem(ACCESS_TOKEN);
                localStorage.removeItem(REFRESH_TOKEN);

                window.location.href = "/login";

                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default api;