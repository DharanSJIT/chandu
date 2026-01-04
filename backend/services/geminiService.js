const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not found in environment variables');
      return;
    }
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  }

  async extractExpenseFromImage(imageBuffer) {
    try {
      if (!this.model) {
        throw new Error('Gemini model not initialized');
      }

      const prompt = `
        Analyze this payment screenshot or SMS and extract expense information.
        Return ONLY a valid JSON object with these exact fields:
        {
          "title": "expense description",
          "amount": 100,
          "category": "Food",
          "date": "2024-01-03",
          "merchant": "store name",
          "confidence": 0.8
        }

        Rules:
        - amount must be a number (not string)
        - category must be one of: Food, Travel, Rent, Entertainment, Healthcare, Shopping, Utilities, Other
        - date format: YYYY-MM-DD
        - confidence: 0.1 to 1.0
        - If unclear, use reasonable defaults
      `;

      const imagePart = {
        inlineData: {
          data: imageBuffer.toString('base64'),
          mimeType: 'image/jpeg'
        }
      };

      const result = await this.model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();

      console.log('Gemini AI Response:', text);

      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        // Return default data if no JSON found
        return {
          title: 'Payment',
          amount: 0,
          category: 'Other',
          date: new Date().toISOString().split('T')[0],
          merchant: 'Unknown',
          confidence: 0.3
        };
      }

      const expenseData = JSON.parse(jsonMatch[0]);
      
      // Validate and set defaults
      return {
        title: expenseData.title || 'Payment',
        amount: Number(expenseData.amount) || 0,
        category: expenseData.category || 'Other',
        date: expenseData.date || new Date().toISOString().split('T')[0],
        merchant: expenseData.merchant || 'Unknown',
        confidence: Number(expenseData.confidence) || 0.5
      };
    } catch (error) {
      console.error('Gemini AI Error:', error);
      // Return fallback data instead of throwing
      return {
        title: 'Payment from Image',
        amount: 0,
        category: 'Other',
        date: new Date().toISOString().split('T')[0],
        merchant: 'Unknown',
        confidence: 0.2
      };
    }
  }

  async categorizeExpense(title, merchant) {
    try {
      if (!this.model) return 'Other';

      const prompt = `Categorize this expense: "${title}" from "${merchant}". Return only one word from: Food, Travel, Rent, Entertainment, Healthcare, Shopping, Utilities, Other`;
      
      const result = await this.model.generateContent(prompt);
      const category = (await result.response.text()).trim();
      
      const validCategories = ['Food', 'Travel', 'Rent', 'Entertainment', 'Healthcare', 'Shopping', 'Utilities', 'Other'];
      return validCategories.includes(category) ? category : 'Other';
    } catch (error) {
      return 'Other';
    }
  }

  async generateBudgetAdvice(expenses, budgets) {
    try {
      if (!this.model) return 'Unable to generate advice';

      const prompt = `Based on expenses: ${JSON.stringify(expenses.slice(0, 10))} and budgets: ${JSON.stringify(budgets)}, give 3 short financial tips in JSON format: {"tips": ["tip1", "tip2", "tip3"]}`;
      
      const result = await this.model.generateContent(prompt);
      const text = await result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const advice = JSON.parse(jsonMatch[0]);
        return advice.tips || ['Track your spending regularly', 'Set realistic budgets', 'Review expenses monthly'];
      }
      return ['Track your spending regularly', 'Set realistic budgets', 'Review expenses monthly'];
    } catch (error) {
      return ['Track your spending regularly', 'Set realistic budgets', 'Review expenses monthly'];
    }
  }

  async predictNextMonthSpending(expenses) {
    try {
      if (!this.model) return { prediction: 0, confidence: 0 };

      const prompt = `Based on these expenses: ${JSON.stringify(expenses.slice(0, 20))}, predict next month's total spending. Return JSON: {"prediction": number, "confidence": 0.1-1.0}`;
      
      const result = await this.model.generateContent(prompt);
      const text = await result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);
        return {
          prediction: Number(data.prediction) || 0,
          confidence: Number(data.confidence) || 0.5
        };
      }
      return { prediction: 0, confidence: 0 };
    } catch (error) {
      return { prediction: 0, confidence: 0 };
    }
  }

  async generateExpenseNote(title, amount, category) {
    try {
      if (!this.model) return '';

      const prompt = `Generate a brief, helpful note for this expense: "${title}" - ₹${amount} in ${category} category. Return only the note text, max 50 words.`;
      
      const result = await this.model.generateContent(prompt);
      const note = (await result.response.text()).trim();
      
      return note || `${category} expense of ₹${amount}`;
    } catch (error) {
      return `${category} expense of ₹${amount}`;
    }
  }

  async parseVoiceExpense(voiceText) {
    try {
      if (!this.model) return null;

      const prompt = `Parse this voice input into expense data: "${voiceText}"
Return ONLY valid JSON:
{
  "title": "expense description",
  "amount": 100,
  "category": "Food",
  "date": "2024-01-03",
  "confidence": 0.8
}

Rules:
- Extract amount as number
- Category: Food, Travel, Rent, Entertainment, Healthcare, Shopping, Utilities, Other
- Use today's date if not specified
- confidence 0.1-1.0 based on clarity`;
      
      const result = await this.model.generateContent(prompt);
      const text = await result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);
        return {
          title: data.title || 'Voice Expense',
          amount: Number(data.amount) || 0,
          category: data.category || 'Other',
          date: data.date || new Date().toISOString().split('T')[0],
          confidence: Number(data.confidence) || 0.5
        };
      }
      return null;
    } catch (error) {
      console.error('Voice parsing error:', error);
      return null;
    }
  }

  async parseNaturalLanguageQuery(query) {
    try {
      if (!this.model) return null;

      const prompt = `Parse this natural language expense query into search filters: "${query}"
Return ONLY valid JSON:
{
  "category": "Food",
  "startDate": "2024-01-01",
  "endDate": "2024-01-31",
  "minAmount": 100,
  "maxAmount": 1000,
  "search": "keyword",
  "sortBy": "date",
  "sortOrder": "desc"
}

Rules:
- category: Food, Travel, Rent, Entertainment, Healthcare, Shopping, Utilities, Other (or null)
- dates in YYYY-MM-DD format (or null)
- amounts as numbers (or null)
- search for keywords in title/notes (or null)
- sortBy: date, amount, category (default: date)
- sortOrder: asc, desc (default: desc)
- Only include fields that are mentioned in the query`;
      
      const result = await this.model.generateContent(prompt);
      const text = await result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const filters = JSON.parse(jsonMatch[0]);
        // Clean up null values
        Object.keys(filters).forEach(key => {
          if (filters[key] === null || filters[key] === 'null') {
            delete filters[key];
          }
        });
        return filters;
      }
      return {};
    } catch (error) {
      console.error('Natural language parsing error:', error);
      return {};
    }
  }
}

module.exports = new GeminiService();