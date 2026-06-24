import Notes from './pages/Notes';
import Test from './components/Test';
import Login from './pages/Login';
import Lists from './pages/Lists';
import Landing from './pages/Landing';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import DashLayout from './Layouts/DashLayout';
import AuthLayout from './Layouts/AuthLayout';
import GuestRoute from './components/GuestRoute';
import ProtectedRoute from './components/ProtectedRoutes';
import { logout } from './utils/authService';
import { Route, Navigate, createBrowserRouter, createRoutesFromElements } from "react-router-dom";

function Logout() {
    logout();
    return <Navigate to="/login" />;
}

export const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path="/" element={<GuestRoute><Landing /></GuestRoute>} />

            <Route path="/dashboard" element={<DashLayout />}>
                <Route index element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="lists" element={<ProtectedRoute><Lists /></ProtectedRoute>} />
                <Route path="notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
            </Route>

            <Route element={<AuthLayout />}>
                <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
                <Route path="/sign-up" element={<GuestRoute><Register /></GuestRoute>} />
            </Route>

            <Route path="/test" element={<Test />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="*" element={<NotFound />} />
        </>
    )
);