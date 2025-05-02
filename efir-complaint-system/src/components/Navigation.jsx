import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import logo from '../assets/image.png';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    setIsAuthenticated(!!token);
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    setUsername('');
    toast.success('Logged out successfully');
    navigate('/');
  };

  const isOnDashboard = location.pathname.startsWith('/dashboard');

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Left side - Logo and Title */}
          <div className="flex items-center space-x-4">
            <img src={logo} alt="e-FIR Logo" className="h-12 w-12" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-purple-600">e-FIR</span>
              <span className="text-lg text-purple-600">Efir Complaint System</span>
            </div>
          </div>

          {/* Middle - Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-purple-600">
              Home
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-purple-600">
              About
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-purple-600">
              Contact
            </Link>
          </div>

          {/* Right side - Auth buttons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {!isOnDashboard && (
                  <Link
                    to="/dashboard"
                    className="text-gray-600 hover:text-purple-600 font-medium"
                  >
                    Dashboard
                  </Link>
                )}
                <span className="text-gray-600 font-medium">Hello, {username}</span>
                <button
                  onClick={handleLogout}
                  className="bg-purple-600 text-white px-6 py-2 rounded-full font-medium hover:bg-purple-700 transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-purple-600 text-white px-6 py-2 rounded-full font-medium hover:bg-purple-700 transition-colors duration-200"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 