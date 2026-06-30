import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config;
    },
    (error) => {
        return Promise.reject(error)
    }
)

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            const refreshToken = localStorage.getItem(REFRESH_TOKEN);

            if (!refreshToken) {
                return Promise.reject(error);
            }

            try {
                const res = await api.post("/accounts/token/refresh/", {
                    refresh: refreshToken
                });
            } catch {
                localStorage.removeItem(ACCESS_TOKEN)
                localStorage.removeItem(REFRESH_TOKEN)

                window.location.href = "/login";
                return Promise.reject(error);
            }

            const newAccessToken = res.data.access;
            localStorage.setItem(ACCESS_TOKEN, newAccessToken);

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            return api(originalRequest);
        }

        return Promise.reject(error);
    }
);

export default api