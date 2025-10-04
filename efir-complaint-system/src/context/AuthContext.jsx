import {createContext, useContext, useEffect, useState} from "react";
import {decryptuser} from "./DecryptionHelper.js";
import axios from "axios";
import {encryptAES} from "../utils/AESEncryption.js";
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const rawUser = localStorage.getItem("user");
        if (rawUser) {
            const decrypted = decryptuser(JSON.parse(rawUser));
            return decrypted;
        }
        return null;
    });

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

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
                const storedRawUser = localStorage.getItem("user");
                if (storedRawUser) {
                    const storedUser = decryptuser(JSON.parse(storedRawUser)); // ❗️Fix: Use decryptuser, not decryptAES directly
                    setUser(storedUser);
                    setIsAuthenticated(true);
                }
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
            console.log("insidelogin");

            const response = await axios.get('http://localhost:8085/user/get?token=' + token, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const user = response.data;
            console.log(user);
            if (response.status === 400 || !user.verified) return false;

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
        return <div>Loading...</div>; // Spinner or placeholder
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