import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API = axios.create({
  // Use local host machine IP for Android Emulator testing or change accordingly
  baseURL: 'http://localhost:5000/api',
});

// Interceptor to retrieve token from SecureStore and attach as Bearer Header
API.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('creatoria_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn('SecureStore retrieval failure:', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const login = async (email, password) => {
  const { data } = await API.post('/auth/login', { email, password });
  return data;
};

export const register = async (name, email, password) => {
  const { data } = await API.post('/auth/register', { name, email, password });
  return data;
};

export const getProducts = async (params = {}) => {
  const { data } = await API.get('/products', { params });
  return data;
};

export const getProduct = async (id) => {
  const { data } = await API.get(`/products/${id}`);
  return data;
};

export const createCheckoutSession = async (productId) => {
  const { data } = await API.post('/checkout/create-session', { productId });
  return data;
};

export const getDownloadUrl = async (productId) => {
  const { data } = await API.get(`/checkout/download/${productId}`);
  return data;
};

export default API;
