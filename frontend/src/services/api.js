import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:3001' });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getStores = (params) => API.get('/stores', { params });
export const getStore = (id) => API.get(`/stores/${id}`);
export const createStore = (data) => API.post('/stores', data);
export const submitRating = (data) => API.post('/ratings', data);
export const getStoreRatings = (id) => API.get(`/ratings/store/${id}`);
export const getStoreAverage = (id) => API.get(`/ratings/store/${id}/average`);
export const getUsers = (params) => API.get('/users', { params });
export const updatePassword = (data) => API.patch('/users/update-password', data);