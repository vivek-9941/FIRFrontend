import {useEffect, useState} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import toast from 'react-hot-toast';
import {useAuth} from '../context/AuthContext';
import {fetchActiveComplaints} from "../utils/session.js";

const Login = () => {
    const navigate = useNavigate();
    const {login} = useAuth();
    const [loginMethod, setLoginMethod] = useState('credentials'); // 'credentials' or 'otp'

    // Credentials login state
    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
        verified: true
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
            console.log('Attempting login with:', {username: credentials.username});
            const response = await fetch('http://localhost:8080/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: credentials.username,
                    password: credentials.password,
                    verified: credentials.verified,
                    role: "USER"
                }),
            });

            console.log('Login response status:', response.status);

            if (response.ok) {
                const token = await response.text();
                console.log('Received token:', token);
                const success = await login(token);
                console.log(1); // Always runs
                if (success) {
                    console.log(2);
                    toast.success('Login successful!');
                    navigate('/dashboard');
                } else {
                    console.log(5);
                    toast.error("Email Verification needed");
                    navigate('/verification');
                }
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
            const response = await fetch(`http://localhost:8080/user/sendOtp?email=${encodeURIComponent(email)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            console.log('OTP Response:', response);

            if (response.ok) {
                setOtpSent(true);
                toast.success('OTP has been sent to your email');
            }else if (response.status === 405) {
                toast.error('please register first');
            } else {
                toast.error('Failed to send OTP. Please try again.');
            }
        } catch (error) {

            console.error('OTP Error:', error);
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
            const response = await fetch(`http://localhost:8080/user/verifyOtp?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            console.log('Verify OTP Response:', response);

            if (response.ok) {
                // Get the token as text since it's a string response
                const token = await response.text();
                console.log('Verify OTP Token:', token);
                // Use the global auth context to handle login
                toast.success('Login successful!');
                const success = await login(token);
                if (success) {
                    navigate('/dashboard');
                }
            } else {
                const errorData = await response.json();
                console.error('Verify OTP Error:', errorData);
                toast.error(errorData.message || 'Invalid OTP');
            }
        } catch (error) {
            console.error('Verify OTP Error:', error);
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
                                        onChange={(e) => setCredentials({...credentials, username: e.target.value})}
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
                                        onChange={(e) => setCredentials({...credentials, password: e.target.value})}
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