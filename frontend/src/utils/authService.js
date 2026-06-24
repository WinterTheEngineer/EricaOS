import api from "../api"
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants"

export const login = async({identifier, password}) => {
    
    const res = await api.post("/accounts/token/", {identifier, password})
    
    localStorage.setItem(ACCESS_TOKEN, res.data.access)
    localStorage.setItem(REFRESH_TOKEN, res.data.refresh)

    return res.data;
}

export const register = async (userData) => {
    const res = await api.post("/accounts/register/", userData);

    return res.data;
}

export function logout() {

    localStorage.removeItem(ACCESS_TOKEN)
    localStorage.removeItem(REFRESH_TOKEN)

    return {"status": 200, "message": "Logged out successfully"}
}

export const refresh = async() => {

    const refreshToken = localStorage.getItem(REFRESH_TOKEN)

    if (!refreshToken) return null;

    const res = await api.post("/accounts/token/refresh/", {
        refresh: refreshToken
    });

    localStorage.setItem(ACCESS_TOKEN, res.data.access);

    return res.data.access;

}