import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on app load
  useEffect(() => {
    const token = localStorage.getItem('userToken'); // Changed from 'token' to 'userToken'
    const userData = localStorage.getItem('userInfo'); // Changed from 'user' to 'userInfo'
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('userToken'); // Changed from 'token' to 'userToken'
        localStorage.removeItem('userInfo'); // Changed from 'user' to 'userInfo'
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('userToken', token); // Changed from 'token' to 'userToken'
    localStorage.setItem('userInfo', JSON.stringify(userData)); // Changed from 'user' to 'userInfo'
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('userToken'); // Changed from 'token' to 'userToken'
    localStorage.removeItem('userInfo'); // Changed from 'user' to 'userInfo'
    sessionStorage.clear();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
