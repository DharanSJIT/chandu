import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, BarChart3, Shield, Smartphone, Brain, Zap, Eye, EyeOff, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const LandingPage = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await login({ email: formData.email, password: formData.password });
        toast.success('Login successful!');
      } else {
        await register({ name: formData.name, email: formData.email, password: formData.password });
        toast.success('Registration successful!');
      }
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', password: '' });
    setShowPassword(false);
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Insights',
      description: 'Smart categorization, voice entry, and predictive analytics powered by advanced AI'
    },
    {
      icon: Smartphone,
      title: 'OCR & Voice Entry',
      description: 'Scan receipts or speak your expenses - technology that adapts to your lifestyle'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Interactive charts, spending trends, and personalized financial recommendations'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Bank-level security with JWT authentication and encrypted data storage'
    },
    {
      icon: Zap,
      title: 'Smart Search',
      description: 'Natural language queries like "show food expenses last month" - just ask and get results'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 fixed top-0 left-0 right-0 z-50 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-900">ExpenseTracker</span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => { setIsLogin(true); setShowAuthModal(true); resetForm(); }}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => { setIsLogin(false); setShowAuthModal(true); resetForm(); }}
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Smart Expense Management
            <span className="block text-blue-600">Powered by AI</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Track expenses effortlessly with voice commands, receipt scanning, and intelligent insights. 
            Your personal finance assistant that learns and adapts to your spending habits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => { setIsLogin(false); setShowAuthModal(true); resetForm(); }}
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              Start Free Trial
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
            <button className="px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need to manage expenses
            </h2>
            <p className="text-lg text-gray-600">
              Professional-grade features designed for modern financial management
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to take control of your finances?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of users who have transformed their expense tracking with AI
          </p>
          <button
            onClick={() => { setIsLogin(false); setShowAuthModal(true); resetForm(); }}
            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Started Today
          </button>
        </div>
      </section>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md relative">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </form>
            
            <div className="px-6 pb-6 text-center">
              <p className="text-gray-600">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={toggleAuthMode}
                  className="ml-1 text-blue-600 hover:text-blue-700 font-semibold"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;