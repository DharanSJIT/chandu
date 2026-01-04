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

router.post('/parse-voice', auth, async (req, res) => {
  try {
    const { voiceText } = req.body;
    const expenseData = await geminiService.parseVoiceExpense(voiceText);
    res.json({ expenseData });
  } catch (error) {
    res.status(500).json({ message: 'Error parsing voice input' });
  }
});

router.post('/parse-query', auth, async (req, res) => {
  try {
    const { query } = req.body;
    const filters = await geminiService.parseNaturalLanguageQuery(query);
    res.json({ filters });
  } catch (error) {
    res.status(500).json({ message: 'Error parsing natural language query' });
  }
});

module.exports = router;