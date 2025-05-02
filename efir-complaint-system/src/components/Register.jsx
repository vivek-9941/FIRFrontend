import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/image.png';
import api from '../utils/api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    aadharNumber: '',
    email: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    }
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const response = await api.post('/user/register', formData);

      if (response.status === 200) {
        setSuccessMessage('Registration successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      console.error('Registration error:', err.response || err);
      
      let errorMessage = '';
      
      if (err.response) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } 
        else if (typeof err.response.data === 'object' && err.response.data !== null) {
          if (err.response.data.message) {
            errorMessage = err.response.data.message;
          } else if (err.response.data.error) {
            errorMessage = err.response.data.error;
          } else {
            switch (err.response.status) {
              case 208:
                errorMessage = 'User already exists.';
                break;
              case 400:
                errorMessage = 'Invalid registration data.';
                break;
              default:
                errorMessage = 'Registration failed. Please try again.';
            }
          }
        }
        else {
          errorMessage = 'An unexpected error occurred.';
        }
      } else if (err.request) {
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        errorMessage = 'Failed to make registration request.';
      }
      
      if (!errorMessage) {
        errorMessage = 'An error occurred during registration.';
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-6xl flex rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Side - Registration Form */}
        <div className="w-2/3 p-12 bg-white">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-purple-700 mb-2">
              Create Account
            </h2>
            <p className="text-gray-600">
              Fill in your details to get started
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
              <span>{error}</span>
              <button 
                onClick={() => setError(null)}
                className="text-red-700 hover:text-red-900"
              >
                ×
              </button>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
              <span>{successMessage}</span>
              <button 
                onClick={() => setSuccessMessage('')}
                className="text-green-700 hover:text-green-900"
              >
                ×
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-purple-700 mb-1">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-purple-600 outline-none transition-colors"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-purple-700 mb-1">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-purple-600 outline-none transition-colors"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-purple-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-purple-600 outline-none transition-colors"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-purple-700 mb-1">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-purple-600 outline-none transition-colors"
                  placeholder="Choose username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-purple-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-purple-600 outline-none transition-colors"
                  placeholder="Create password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="aadharNumber" className="block text-sm font-medium text-purple-700 mb-1">
                  Aadhar Number
                </label>
                <input
                  id="aadharNumber"
                  name="aadharNumber"
                  type="text"
                  required
                  pattern="[0-9]{12}"
                  maxLength="12"
                  className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-purple-600 outline-none transition-colors"
                  placeholder="Enter 12-digit Aadhar number"
                  value={formData.aadharNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="col-span-2">
                <label htmlFor="address.street" className="block text-sm font-medium text-purple-700 mb-1">
                  Street Address
                </label>
                <input
                  id="address.street"
                  name="address.street"
                  type="text"
                  required
                  className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-purple-600 outline-none transition-colors"
                  placeholder="Enter street address"
                  value={formData.address.street}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="address.city" className="block text-sm font-medium text-purple-700 mb-1">
                  City
                </label>
                <input
                  id="address.city"
                  name="address.city"
                  type="text"
                  required
                  className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-purple-600 outline-none transition-colors"
                  placeholder="Enter city"
                  value={formData.address.city}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="address.state" className="block text-sm font-medium text-purple-700 mb-1">
                  State
                </label>
                <input
                  id="address.state"
                  name="address.state"
                  type="text"
                  required
                  className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-purple-600 outline-none transition-colors"
                  placeholder="Enter state"
                  value={formData.address.state}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="address.zip" className="block text-sm font-medium text-purple-700 mb-1">
                  ZIP Code
                </label>
                <input
                  id="address.zip"
                  name="address.zip"
                  type="text"
                  required
                  pattern="[0-9]{6}"
                  maxLength="6"
                  className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-purple-600 outline-none transition-colors"
                  placeholder="Enter ZIP code"
                  value={formData.address.zip}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="address.country" className="block text-sm font-medium text-purple-700 mb-1">
                  Country
                </label>
                <input
                  id="address.country"
                  name="address.country"
                  type="text"
                  required
                  className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-purple-600 outline-none transition-colors"
                  placeholder="Enter country"
                  value={formData.address.country}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 text-white py-3 px-6 rounded-full hover:bg-purple-700 transition-colors duration-300 flex items-center justify-center group mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering...
                </>
              ) : (
                <>
                  Create Account
                  <svg 
                    className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 5l7 7-7 7" 
                    />
                  </svg>
                </>
              )}
            </button>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-purple-600 hover:text-purple-800 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Right Side - Purple Section */}
        <div className="w-1/3 bg-purple-600 p-12 text-white flex flex-col items-center justify-center relative">
          <div className="absolute top-4 right-4">
          <img src={logo} alt="Logo" className="h-[100px] w-[100px] bg-white rounded-lg" />

          </div>
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Efir Complaint System</h2>
            <p className="text-lg text-purple-200">
              Join us to manage and track your complaints effectively
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 