import api from './authService';

export const aiService = {
  getFinancialAdvice: () => api.get('/ai/advice'),
  getSpendingPrediction: () => api.get('/ai/prediction'),
  categorizeExpense: (title, merchant) => api.post('/ai/categorize', { title, merchant })
};