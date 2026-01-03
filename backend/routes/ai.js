const express = require('express');
const { getFinancialAdvice, getSpendingPrediction, categorizeExpense } = require('../controllers/aiController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/advice', auth, getFinancialAdvice);
router.get('/prediction', auth, getSpendingPrediction);
router.post('/categorize', auth, categorizeExpense);

module.exports = router;