import { Navigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import { ACCESS_TOKEN } from "../constants"

function GuestRoute({ children }) {
    const token = localStorage.getItem(ACCESS_TOKEN)

    // If no token → user is a guest → allow access
    if (!token) return children

    // If token exists but is expired → allow login/register
    try {
        const decoded = jwtDecode(token)
        const tokenExpiration = decoded.exp
        const now = Date.now() / 1000

        if (tokenExpiration < now) {
            return children
        }
    } catch {
        return children
    }

    // Otherwise → user is already logged in → redirect to home
    return <Navigate to="/" />
}

export default GuestRoute