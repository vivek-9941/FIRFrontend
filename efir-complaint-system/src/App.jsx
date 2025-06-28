import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './components/Login';
import PoliceLogin from './components/PoliceLogin';
import Register from './components/Register';
import Landing from './components/Landing';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import PoliceDashboard from './components/PoliceDashboard';
import './App.css'
import Dashboard from "./components/DashBoard/Dashboard.jsx";
import Verification from "./components/Verification.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            success: {
              duration: 3000,
              style: {
                background: '#4ade80',
                color: 'white',
              },
            },
            error: {
              duration: 4000,
              style: {
                background: '#ef4444',
                color: 'white',
              },
            },
          }}
        />
        <div className="min-h-screen bg-gray-50">

          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/police-login" element={<PoliceLogin />} />
            <Route path="/register" element={<Register />} />
              <Route path="/verification" element={<Verification/>}/>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/police-dashboard"
              element={
                <ProtectedRoute requiredRole="POLICE">
                  <PoliceDashboard />
                </ProtectedRoute>
              }
            />
            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
