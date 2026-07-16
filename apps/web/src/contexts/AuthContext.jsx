import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  authSignIn,
  authSignUp,
  authSignOut,
  authGetUser,
  fetchProfile,
} from '@/lib/authClient';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restaura sessão do localStorage na inicialização
    const restoreSession = async () => {
      try {
        const user = authGetUser();
        if (user) {
          const profile = await fetchProfile(user.id);
          setCurrentUser({ ...user, ...(profile || {}) });
        }
      } catch (e) {
        console.error('restoreSession error:', e);
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = async (email, password) => {
    const data = await authSignIn(email, password);
    const profile = await fetchProfile(data.user.id, data.access_token);
    const user = { ...data.user, ...(profile || {}) };
    setCurrentUser(user);
    return user;
  };

  const signup = async (nome, email, password) => {
    const data = await authSignUp(email, password, { nome, role: 'member' });
    if (data.user) {
      const profile = await fetchProfile(data.user.id, data.access_token);
      setCurrentUser({ ...data.user, ...(profile || {}) });
    }
    return data.user;
  };

  const logout = async () => {
    await authSignOut();
    setCurrentUser(null);
  };

  const refreshProfile = async () => {
    if (!currentUser?.id) return;
    const profile = await fetchProfile(currentUser.id);
    if (profile) setCurrentUser(prev => ({ ...prev, ...profile }));
  };

  const value = {
    currentUser,
    login,
    signup,
    logout,
    refreshProfile,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === 'admin',
    isMember: currentUser?.role === 'member',
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
