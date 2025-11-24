import api from "../api"
import {jwtDecode} from "jwt-decode"
import {Navigate} from "react-router-dom"
import { useState, useEffect } from "react"
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants"

function ProtectedRoute({children}) {
    const [isAuthorized, setIsAuthorized] = useState(null)

    useEffect(() => {
        auth().catch(() => setIsAuthorized(false))
    }, [])

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN)

        try {
            const res = await api.post("/api/token/refresh/",
                {refresh: refreshToken}
            );
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                setIsAuthorized(true)
            } else {
                setIsAuthorized(false)
            }
        } catch (err) {
            console.log(err)
            setIsAuthorized(false)
        }
    }

    // Checks for access token
    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN)
        if (!token) {
            // token isn't available, user is not authorized
            setIsAuthorized(false)
            return
        }

        // token was found
        const decoded = jwtDecode(token)
        const tokenExpiration = decoded.exp
        const now = Date.now() /  1000

        if (tokenExpiration < now) {
            // token has expired, get a new one
            await refreshToken()
        } else {
            // token was found and is still valid
            setIsAuthorized(true)
        }
    }

    if (isAuthorized === null) {
        // token is still being retrived
        return <div>Loading...</div>
    }

    // if user is authorized, load children; if not, make them login and get one
    return isAuthorized ? children : <Navigate to="/login" />
}

export default ProtectedRoute