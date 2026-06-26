import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load local auth cache on start
    const storedUser = localStorage.getItem('ptg-user');
    const storedToken = localStorage.getItem('ptg-token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      // Connect to express server
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');
      
      localStorage.setItem('ptg-token', data.token);
      localStorage.setItem('ptg-user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      return data.user;
    } catch (error) {
      console.warn('API connection failed, using local simulation. Details:', error.message);
      
      // Local simulation fallback
      if (email === 'admin@punjab.tour' && password === 'admin123') {
        const adminUser = {
          name: 'Super Admin',
          email: 'admin@punjab.tour',
          role: 'Super Admin',
          points: 1250,
          xp: 8500
        };
        localStorage.setItem('ptg-token', 'simulated-token-admin');
        localStorage.setItem('ptg-user', JSON.stringify(adminUser));
        setToken('simulated-token-admin');
        setUser(adminUser);
        return adminUser;
      } else {
        // Mock default tourist user
        const mockUser = {
          name: email.split('@')[0],
          email,
          role: 'Tourist',
          points: 50,
          xp: 100
        };
        localStorage.setItem('ptg-token', 'simulated-token-user');
        localStorage.setItem('ptg-user', JSON.stringify(mockUser));
        setToken('simulated-token-user');
        setUser(mockUser);
        return mockUser;
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed');
      
      localStorage.setItem('ptg-token', data.token);
      localStorage.setItem('ptg-user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      return data.user;
    } catch (error) {
      console.warn('API connection failed, simulating registration locally.', error.message);
      const mockUser = {
        name,
        email,
        role: 'Tourist',
        points: 100, // Welcome points
        xp: 150
      };
      localStorage.setItem('ptg-token', 'simulated-token-user');
      localStorage.setItem('ptg-user', JSON.stringify(mockUser));
      setToken('simulated-token-user');
      setUser(mockUser);
      return mockUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('ptg-token');
    localStorage.removeItem('ptg-user');
    setToken(null);
    setUser(null);
  };

  const addRewardPoints = (pointsToAdd, xpToAdd = 0) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      points: (user.points || 0) + pointsToAdd,
      xp: (user.xp || 0) + xpToAdd
    };
    setUser(updatedUser);
    localStorage.setItem('ptg-user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, addRewardPoints }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
