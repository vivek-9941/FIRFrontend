import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loginMethod, setLoginMethod] = useState('credentials'); // 'credentials' or 'otp'
  
  // Credentials login state
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  // OTP login state
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle traditional login
  const handleCredentialsLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log('Attempting login with:', { username: credentials.username });
      const response = await fetch('http://localhost:8080/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password
        }),
      });
      
      console.log('Login response status:', response.status);

      if (response.ok) {
        // Get the token directly from response text
        const token = await response.text();
        console.log('Received token:', token);

        // Use the global auth context to handle login
        login(token, credentials.username);
        
        // Show success toast
        toast.success('Login successful!');
        // Navigate to dashboard
        navigate('/dashboard');
      } else {
        // For error cases, we expect JSON
        const data = await response.json();
        // Handle login error with toast
        const errorMessage = data.message || data.error || 'Login failed. Please check your credentials.';
        console.error('Login error:', errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Login error details:', error);
      toast.error('Login failed. Please check your username and password.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP generation
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/user/sendOtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      if (response.ok) {
        setOtpSent(true);
        toast.success('OTP has been sent to your email');
      } else {
        toast.error(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP verification
  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/user/verifyOtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });
      
      const data = await response.json();
      if (response.ok) {
        // Store JWT token in localStorage
        localStorage.setItem('token', data.token);
        // Store user data if available
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        toast.success('Login successful!');
        // Navigate to dashboard
        navigate('/dashboard');
      } else {
        toast.error(data.message || 'Invalid OTP');
      }
    } catch (error) {
      toast.error('Failed to verify OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          
          {/* Login Method Toggle */}
          <div className="mt-6 flex justify-center space-x-4">
            <button
              onClick={() => setLoginMethod('credentials')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                loginMethod === 'credentials'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Username & Password
            </button>
            <button
              onClick={() => {
                setLoginMethod('otp');
                setOtpSent(false);
                setOtp('');
              }}
              className={`px-4 py-2 rounded-lg transition-colors ${
                loginMethod === 'otp'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Email OTP
            </button>
          </div>
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Username & Password Login Form */}
          {loginMethod === 'credentials' && (
            <form className="space-y-6" onSubmit={handleCredentialsLogin}>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <div className="mt-1">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={credentials.username}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>
          )}

          {/* Email OTP Login Form */}
          {loginMethod === 'otp' && (
            <form className="space-y-6" onSubmit={otpSent ? handleOtpVerification : handleSendOtp}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={otpSent}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100"
                  />
                </div>
              </div>

              {otpSent && (
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                    Enter OTP
                  </label>
                  <div className="mt-1">
                    <input
                      id="otp"
                      name="otp"
                      type="text"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Enter the OTP sent to your email"
                    />
                  </div>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading
                    ? otpSent
                      ? 'Verifying...'
                      : 'Sending OTP...'
                    : otpSent
                    ? 'Verify OTP'
                    : 'Send OTP'}
                </button>
              </div>

              {otpSent && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="text-sm text-purple-600 hover:text-purple-500"
                  >
                    Change email or resend OTP
                  </button>
                </div>
              )}
            </form>
          )}
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-purple-600 hover:text-purple-500">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 