import { createContext, useContext, useState, useEffect } from 'react';
import {useNavigate} from "react-router-dom";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

// const navigate = useNavigate();

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('token');
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

  const login = async (token) => {
    try {
      const response = await axios.get('http://localhost:8080/user/get?token=' + token,{headers:{Authorization:`Bearer ${token}`}});
     const user = response.data;
     if(response.status === 400){
       return false;
     }
      console.log(token)
      console.log(user)
        console.log(user.verified)

      if(user.verified){
          console.log(4)
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      setIsAuthenticated(true);
      return true;
      }
      else{
          console.log(5)
        return false;
      }

    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    checkAuthStatus,
    isLoading,
    login,
    logout,
  };

  if (isLoading) {
    return <div>Loading...</div>; // You can replace this with a proper loading component
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