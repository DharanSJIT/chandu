import { useState, useEffect } from 'react';
import { expenseService } from '../services/authService';
import { aiService } from '../services/aiService';
import { Plus, Edit, Trash2, Search, Filter, Calendar, Tag, DollarSign, FileText, MoreVertical, Eye, Camera, Sparkles, Mic } from 'lucide-react';
import toast from 'react-hot-toast';
import OCRUpload from '../components/OCRUpload';
import VoiceInput from '../components/VoiceInput';
import SmartSearch from '../components/SmartSearch';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showOCRModal, setShowOCRModal] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showSmartSearch, setShowSmartSearch] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    startDate: '',
    endDate: ''
  });

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [generatingNote, setGeneratingNote] = useState(false);

  const categories = [
    { name: 'Food', icon: '🍽️', color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/20' },
    { name: 'Travel', icon: '✈️', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20' },
    { name: 'Rent', icon: '🏠', color: 'bg-green-100 text-green-600 dark:bg-green-900/20' },
    { name: 'Entertainment', icon: '🎬', color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20' },
    { name: 'Healthcare', icon: '🏥', color: 'bg-red-100 text-red-600 dark:bg-red-900/20' },
    { name: 'Shopping', icon: '🛍️', color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/20' },
    { name: 'Utilities', icon: '⚡', color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20' },
    { name: 'Other', icon: '📝', color: 'bg-gray-100 text-gray-600 dark:bg-gray-900/20' }
  ];

  const getCategoryInfo = (categoryName) => {
    return categories.find(cat => cat.name === categoryName) || categories[categories.length - 1];
  };

  useEffect(() => {
    fetchExpenses();
  }, [filters]);

  const fetchExpenses = async () => {
    try {
      const response = await expenseService.getExpenses(filters);
      setExpenses(response.data.expenses);
    } catch (error) {
      toast.error('Error fetching expenses');
    } finally {
      setLoading(false);
    }
  };

  const generateAINote = async () => {
    if (!formData.title || !formData.amount || !formData.category) {
      toast.error('Please fill title, amount, and category first');
      return;
    }
    
    setGeneratingNote(true);
    try {
      const response = await aiService.generateNote(formData.title, formData.amount, formData.category);
      setFormData({...formData, notes: response.data.note});
      toast.success('AI note generated!');
    } catch (error) {
      toast.error('Failed to generate note');
    } finally {
      setGeneratingNote(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingExpense) {
        await expenseService.updateExpense(editingExpense._id, formData);
        toast.success('Expense updated successfully');
      } else {
        await expenseService.createExpense(formData);
        toast.success('Expense created successfully');
      }
      setShowModal(false);
      setEditingExpense(null);
      resetForm();
      fetchExpenses();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving expense');
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date: new Date(expense.date).toISOString().split('T')[0],
      notes: expense.notes || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await expenseService.deleteExpense(id);
        toast.success('Expense deleted successfully');
        fetchExpenses();
      } catch (error) {
        toast.error('Error deleting expense');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      amount: '',
      category: 'Food',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleOCRExpense = (extractedData) => {
    setFormData({
      title: extractedData.title,
      amount: extractedData.amount.toString(),
      category: extractedData.category,
      date: extractedData.date,
      notes: extractedData.merchant ? `Merchant: ${extractedData.merchant}` : 'Auto-extracted from image'
    });
    setShowModal(true);
  };

  const handleVoiceExpense = (voiceData) => {
    setFormData({
      title: voiceData.title,
      amount: voiceData.amount.toString(),
      category: voiceData.category,
      date: voiceData.date,
      notes: `Voice entry (${Math.round(voiceData.confidence * 100)}% confidence)`
    });
    setShowModal(true);
  };

  const handleSmartSearch = (parsedFilters) => {
    setFilters({
      ...filters,
      ...parsedFilters
    });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      startDate: '',
      endDate: ''
    });
  };

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const filteredTotal = expenses.length > 0 ? totalAmount : 0;
  const categoryTotal = filters.category ? 
    `${filters.category} Total: ₹${totalAmount.toFixed(2)}` : 
    `Total Amount: ₹${totalAmount.toFixed(2)}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Expense Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track and organize your financial transactions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
              showFilters 
                ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
            }`}
          >
            <Filter className="w-4 h-4 mr-1 inline" />
            Filters
          </button>
          <button
            onClick={() => setShowSmartSearch(true)}
            className="px-3 py-2 rounded-lg text-sm font-medium bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
          >
            <Sparkles className="w-4 h-4 mr-1 inline" />
            Smart Search
          </button>
          <button
            onClick={() => setShowVoiceModal(true)}
            className="px-3 py-2 rounded-lg text-sm font-medium bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
          >
            <Mic className="w-4 h-4 mr-1 inline" />
            Voice
          </button>
          <button
            onClick={() => setShowOCRModal(true)}
            className="px-3 py-2 rounded-lg text-sm font-medium bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
          >
            <Camera className="w-4 h-4 mr-1 inline" />
            Scan
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-1 inline" />
            Add Expense
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {filters.category ? `${filters.category} Total` : 'Total Amount'}
              </p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                ₹{totalAmount.toLocaleString()}
              </p>
              {filters.category && (
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Filtered by {filters.category}
                </p>
              )}
            </div>
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {filters.category ? `${filters.category} Count` : 'Total Expenses'}
              </p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">{expenses.length}</p>
              {filters.category && (
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  {filters.category} expenses
                </p>
              )}
            </div>
            <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Average Amount</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                ₹{expenses.length > 0 ? (totalAmount / expenses.length).toLocaleString() : '0'}
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <Tag className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-medium text-gray-900 dark:text-white">Filter Options</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Clear All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="search"
                placeholder="Search expenses..."
                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.search}
                onChange={handleFilterChange}
              />
            </div>
            <select
              name="category"
              className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.name} value={cat.name}>{cat.icon} {cat.name}</option>
              ))}
            </select>
            <input
              type="date"
              name="startDate"
              className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
            <input
              type="date"
              name="endDate"
              className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </div>
        </div>
      )}

      {/* Expenses List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        {loading ? (
          <div className="p-8">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                </div>
              ))}
            </div>
          </div>
        ) : expenses.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No expenses found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Get started by adding your first expense</p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Add Expense
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {expenses.map((expense) => {
              const categoryInfo = getCategoryInfo(expense.category);
              return (
                <div key={expense._id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${categoryInfo.color}`}>
                        <span className="text-xl">{categoryInfo.icon}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {expense.title}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${categoryInfo.color}`}>
                            {expense.category}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(expense.date).toLocaleDateString()}</span>
                          </div>
                          {expense.notes && (
                            <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                              <FileText className="w-4 h-4" />
                              <span className="truncate max-w-xs">{expense.notes}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                          ₹{expense.amount.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(expense)}
                          className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(expense._id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-2xl border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingExpense ? 'Edit Expense' : 'Add New Expense'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {editingExpense ? 'Update your expense details' : 'Enter the details of your new expense'}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter expense title"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Enter amount"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    {categories.map(cat => (
                      <option key={cat.name} value={cat.name}>{cat.icon} {cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Notes (Optional)
                    </label>
                    <button
                      type="button"
                      onClick={generateAINote}
                      disabled={generatingNote || !formData.title || !formData.amount}
                      className="flex items-center space-x-1 text-xs text-primary hover:text-primary/80 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>{generatingNote ? 'Generating...' : 'AI Generate'}</span>
                    </button>
                  </div>
                  <textarea
                    placeholder="Add any notes about this expense"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    rows="3"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-8">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingExpense(null);
                    resetForm();
                  }}
                  className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors font-medium shadow-sm"
                >
                  {editingExpense ? 'Update Expense' : 'Add Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* OCR Modal */}
      {showOCRModal && (
        <OCRUpload
          onExpenseExtracted={handleOCRExpense}
          onClose={() => setShowOCRModal(false)}
        />
      )}
      
      {/* Voice Input Modal */}
      {showVoiceModal && (
        <VoiceInput
          onExpenseParsed={handleVoiceExpense}
          onClose={() => setShowVoiceModal(false)}
        />
      )}
      
      {/* Smart Search Modal */}
      {showSmartSearch && (
        <SmartSearch
          onFiltersApplied={(filters) => {
            setFilters({...filters, ...filters});
            setShowSmartSearch(false);
          }}
          onClose={() => setShowSmartSearch(false)}
        />
      )}
    </div>
  );
};

export default Expenses;