import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../service/auth.service.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [teacher, setTeacher] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loggedInTeacher = authService.getLoggedInTeacher();
    if (loggedInTeacher) {
      setTeacher(loggedInTeacher);
    }
    setIsLoading(false);
  }, []);

  async function login(email, password) {
    console.log('AuthContext: Login attempt for:', email);
    try {
      const loggedInTeacher = await authService.login(email, password);
      console.log('AuthContext: Login successful:', loggedInTeacher);
      setTeacher(loggedInTeacher);
      return loggedInTeacher;
    } catch (err) {
      console.error('AuthContext: Login failed:', err);
      // Clear any stale data
      setTeacher(null);
      throw err;
    }
  }

  async function logout() {
    try {
      await authService.logout();
      setTeacher(null);
    } catch (err) {
      console.error('AuthContext: Logout failed:', err);
      // Still clear the state even if logout request fails
      setTeacher(null);
      throw err;
    }
  }

  const value = {
    teacher,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
