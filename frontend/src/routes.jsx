import Notes from './pages/Notes';
import Login from './pages/Login';
import Lists from './pages/Lists';
import Landing from './pages/Landing';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import DashLayout from './Layouts/DashLayout';
import AuthLayout from './Layouts/AuthLayout';
import GuestRoute from './components/GuestRoute';
import { Route, Navigate, createBrowserRouter, createRoutesFromElements, Routes } from "react-router-dom"
import ProtectedRoute from './components/ProtectedRoutes';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants'

function Logout() {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);

    return <Navigate to="/login" />;
}

function RegisterAndLogout() {
	localStorage.clear()
	return <Register />
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
        <Route path="/register" element={<GuestRoute><RegisterAndLogout /></GuestRoute>} />
      </Route>

      <Route path="/logout" element={<Logout />} />
      <Route path="*" element={<NotFound />} />
    </>
  )
);
