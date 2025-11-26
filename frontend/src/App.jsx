import Login from './pages/Login'
import Notes from './pages/Notes'
import NotFound from './pages/NotFound'
import Register from './pages/Register'
import ProtectedRoute from './components/ProtectedRoutes'
import GuestRoute from './components/GuestRoute'
import { Routes, Route, Navigate } from 'react-router-dom'

function Logout() {
	localStorage.clear()
	return <Navigate to="/login" />
}

function RegisterAndLogout() {
	localStorage.clear()
	return <Register />
}

function App() {

  return (
    <Routes>
		<Route path="/" element={
			<ProtectedRoute>
				<Notes />
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
	</Routes>
  )
}

export default App
