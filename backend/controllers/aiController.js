const geminiService = require('../services/geminiService');
const Expense = require('../models/Expense');
const Budget = require('../models/Budget');

const getFinancialAdvice = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).limit(20).sort({ date: -1 });
    const budgets = await Budget.find({ user: req.user.id });
    
    const advice = await geminiService.generateBudgetAdvice(expenses, budgets);
    res.json({ advice });
  } catch (error) {
    res.status(500).json({ message: 'Error generating advice' });
  }
};

const getSpendingPrediction = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).limit(50).sort({ date: -1 });
    const prediction = await geminiService.predictNextMonthSpending(expenses);
    res.json(prediction);
  } catch (error) {
    res.status(500).json({ message: 'Error generating prediction' });
  }
};

const categorizeExpense = async (req, res) => {
  try {
    const { title, merchant } = req.body;
    const category = await geminiService.categorizeExpense(title, merchant);
    res.json({ category });
  } catch (error) {
    res.status(500).json({ message: 'Error categorizing expense' });
  }
};

module.exports = {
  getFinancialAdvice,
  getSpendingPrediction,
  categorizeExpense
};