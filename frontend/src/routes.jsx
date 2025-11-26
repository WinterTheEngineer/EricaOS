import Notes from './pages/Notes';
import Login from './pages/Login';
import Lists from './pages/Lists';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import DashLayout from './Layouts/DashLayout';
import GuestRoute from './components/GuestRoute';
import { Route, Navigate, createBrowserRouter, createRoutesFromElements } from "react-router-dom"
import ProtectedRoute from './components/ProtectedRoutes';

function Logout() {
	localStorage.clear()
	return <Navigate to="/login" />
}

function RegisterAndLogout() {
	localStorage.clear()
	return <Register />
}

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<DashLayout />}>
            <Route index element={
                <ProtectedRoute>
                    <Notes />
                </ProtectedRoute>
            } />
            
            <Route path='/Lists' element={
                <ProtectedRoute>
                    <Lists />
                </ProtectedRoute>
            } />
            
            <Route path="/login" element={
                <GuestRoute>
                    <Login />
                </GuestRoute>
            } />
            <Route path="/logout" element={<Logout />} />
            <Route path="/register" element={
                <GuestRoute>
                    <RegisterAndLogout />
                </GuestRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
        </Route>
    )
)