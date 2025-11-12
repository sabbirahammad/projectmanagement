import React, { createContext, useContext, useState, useEffect } from 'react';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Decode token or fetch user info
      // For simplicity, assume user info is in localStorage or decode JWT
      let userInfo = JSON.parse(localStorage.getItem('user') || '{}');

      console.log('AuthContext - Loaded user info:', userInfo);
      if (userInfo && Object.keys(userInfo).length > 0) {
        setUser(userInfo);
      } else {
        // Backward compatibility: if 'user' is not set, try to construct from old format
        const userName = localStorage.getItem('userName');
        const userType = localStorage.getItem('userType');
        if (userName && userType) {
          userInfo = {
            name: userName,
            type: userType,
            id: null,
            email: '',
            image: ''
          };
          setUser(userInfo);
          // Optionally, update localStorage with new format
          localStorage.setItem('user', JSON.stringify(userInfo));
        } else {
          setUser(null);
        }
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    // Remove page reload - use state updates instead
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};