import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
};

export const expenseService = {
  getExpenses: (params) => api.get('/expenses', { params }),
  createExpense: (expense) => api.post('/expenses', expense),
  updateExpense: (id, expense) => api.put(`/expenses/${id}`, expense),
  deleteExpense: (id) => api.delete(`/expenses/${id}`),
  getAnalytics: () => api.get('/expenses/analytics'),
};

export const budgetService = {
  getBudgets: () => api.get('/budgets'),
  createBudget: (budget) => api.post('/budgets', budget),
  updateBudget: (id, budget) => api.put(`/budgets/${id}`, budget),
  deleteBudget: (id) => api.delete(`/budgets/${id}`),
};

export default api;