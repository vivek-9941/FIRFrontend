import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import logo from '../assets/image.png';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const navigate = useNavigate();
  const { checkAuthStatus} = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOnDashboard, setIsOnDashboard] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const verifyAuth = async () => {
      const auth = await checkAuthStatus();

      setIsAuthenticated(auth);
      const data = JSON.parse(localStorage.getItem("user"));
      setUser(data);
    };
    verifyAuth();

  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    setIsAuthenticated(false);
  };

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
            {isAuthenticated && user?.role === 'POLICE' && (
              <Link
                to="/police-dashboard"
                className="text-gray-600 hover:text-purple-600"
              >
                Police Dashboard
              </Link>
            )}
            {isAuthenticated && user?.role === "USER" && (
              <Link
                to="/dashboard"
                className="text-gray-600 hover:text-purple-600"
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Right side - Auth buttons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>

                <span className="text-gray-600 font-medium">Hello, {user?.firstName.toUpperCase()}</span>
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
                  to="/police-login"
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  Police Login
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