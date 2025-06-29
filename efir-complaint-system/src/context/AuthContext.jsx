// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // start with loading true

    const checkAuthStatus = (token) => {
        try {
            const payloadBase64 = token.split('.')[1];
            const decodedPayload = JSON.parse(atob(payloadBase64));
            const expiry = decodedPayload.exp;
            const now = Math.floor(Date.now() / 1000);
            return now < expiry;
        } catch (e) {
            return false;
        }
    };

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setIsAuthenticated(false);
                setUser(null);
                setIsLoading(false);
                return;
            }

            const isValid = checkAuthStatus(token);
            if (isValid) {
                const storedUser = JSON.parse(localStorage.getItem("user"));
                setUser(storedUser);
                setIsAuthenticated(true);
            } else {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setUser(null);
                setIsAuthenticated(false);
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = async (token) => {
        try {
            const response = await axios.get(
                'http://localhost:8080/user/get?token=' + token,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const user = response.data;

            if (response.status === 400 || !user.verified) {
                return false;
            }

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            setIsAuthenticated(true);
            return true;

        } catch (error) {
            console.error('Login failed:', error);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
    };

    const value = {
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
    };

    if (isLoading) {
        return <div>Loading...</div>; // Replace with your spinner component if available
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
