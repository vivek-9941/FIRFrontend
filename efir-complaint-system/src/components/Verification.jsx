import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {useAuth} from "../context/AuthContext.jsx";
import toast from "react-hot-toast";

const Verification = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const {login} = useAuth();

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
            } else if (response.status === 405) {
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
                localStorage.clear();
                const token = await response.text();
                console.log('Verify OTP Token:', token);
                // Use the global auth context to handle login
                toast.success('Login successful!');
                if (login(token)) {
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
    )

}

export default Verification;