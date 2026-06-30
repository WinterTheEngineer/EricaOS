import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { REFRESH_TOKEN } from "../constants";

function ProtectedRoute({ children }) {
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        setIsAuthorized(!!refreshToken);
    }, []);

    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }

    return isAuthorized
        ? children
        : <Navigate to="/login" replace />;
}

export default ProtectedRoute;