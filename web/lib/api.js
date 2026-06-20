import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

// Interceptor to attach Authorization Bearer token from local storage
API.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('creatoria_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to redirect to login if token is expired or unauthorized
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('creatoria_token');
        localStorage.removeItem('creatoria_user');
        // Do not force redirect instantly on every single request error to avoid flashing,
        // but can trigger a redirect or broadcast event if on a secure page
        if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register') && window.location.pathname !== '/') {
          window.location.href = '/login?expired=true';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth Endpoints
export const login = async (credentials) => {
  const { data } = await API.post('/auth/login', credentials);
  return data;
};

export const register = async (userData) => {
  const { data } = await API.post('/auth/register', userData);
  return data;
};

export const getMe = async () => {
  const { data } = await API.get('/auth/me');
  return data;
};

// Vendor Endpoints
export const applyVendor = async (vendorData) => {
  const { data } = await API.post('/vendors/apply', vendorData);
  return data;
};

export const getVendorOnboardingLink = async () => {
  const { data } = await API.get('/vendors/onboard');
  return data;
};

export const getVendorDashboard = async () => {
  const { data } = await API.get('/vendors/dashboard');
  return data;
};

export const getPendingVendors = async () => {
  const { data } = await API.get('/vendors/pending');
  return data;
};

export const approveVendor = async (vendorId) => {
  const { data } = await API.put(`/vendors/${vendorId}/approve`);
  return data;
};

// Product Endpoints
export const getProducts = async (params = {}) => {
  const { data } = await API.get('/products', { params });
  return data;
};

export const getProduct = async (id) => {
  const { data } = await API.get(`/products/${id}`);
  return data;
};

export const createProduct = async (productData) => {
  const { data } = await API.post('/products', productData);
  return data;
};

export const updateProduct = async (id, productData) => {
  const { data } = await API.put(`/products/${id}`, productData);
  return data;
};

export const deleteProduct = async (id) => {
  const { data } = await API.delete(`/products/${id}`);
  return data;
};

export const getS3UploadUrl = async (fileName, contentType) => {
  const { data } = await API.post('/products/upload-url', { fileName, contentType });
  return data;
};

// Checkout & Downloads Endpoints
export const createCheckoutSession = async (productId) => {
  const { data } = await API.post('/checkout/create-session', { productId });
  return data;
};

export const getDownloadUrl = async (productId) => {
  const { data } = await API.get(`/checkout/download/${productId}`);
  return data;
};

// Admin overview analytics mock query (derived or simplified metrics)
export const getAdminStats = async () => {
  // Pull metrics from normal dashboards or stubs since we run a single monorepo DB
  const { data } = await API.get('/vendors/pending');
  return data;
};

export default API;
