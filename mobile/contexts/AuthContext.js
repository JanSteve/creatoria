import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { login as apiLogin, register as apiRegister } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('creatoria_token');
        const storedUser = await SecureStore.getItemAsync('creatoria_user');
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.warn('Failed to restore auth credentials:', e);
      } finally {
        setLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await apiLogin(email, password);
      const { token: jwt, user: userProfile } = response.data;
      
      await SecureStore.setItemAsync('creatoria_token', jwt);
      await SecureStore.setItemAsync('creatoria_user', JSON.stringify(userProfile));
      
      setToken(jwt);
      setUser(userProfile);
      return response;
    } catch (e) {
      setLoading(false);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const response = await apiRegister(name, email, password);
      setLoading(false);
      return response;
    } catch (e) {
      setLoading(false);
      throw e;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await SecureStore.deleteItemAsync('creatoria_token');
      await SecureStore.deleteItemAsync('creatoria_user');
      setToken(null);
      setUser(null);
    } catch (e) {
      console.warn('Logout secure storage clear failure:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
