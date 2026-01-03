const express = require('express');
const { getFinancialAdvice, getSpendingPrediction, categorizeExpense } = require('../controllers/aiController');
const auth = require('../middleware/auth');
const geminiService = require('../services/geminiService');

const router = express.Router();

router.get('/advice', auth, getFinancialAdvice);
router.get('/prediction', auth, getSpendingPrediction);
router.post('/categorize', auth, categorizeExpense);
router.post('/generate-note', auth, async (req, res) => {
  try {
    const { title, amount, category } = req.body;
    const note = await geminiService.generateExpenseNote(title, amount, category);
    res.json({ note });
  } catch (error) {
    res.status(500).json({ message: 'Error generating note' });
  }
});

module.exports = router;