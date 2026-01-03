import { useState, useEffect } from 'react';
import { expenseService } from '../services/authService';
import { DollarSign, TrendingUp, Calendar, Tag, Plus, ArrowUpRight, ArrowDownRight, Clock, Target, AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [analyticsRes, expensesRes] = await Promise.all([
        expenseService.getAnalytics(),
        expenseService.getExpenses({ limit: 5 })
      ]);
      setAnalytics(analyticsRes.data);
      setRecentExpenses(expensesRes.data.expenses || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow h-32"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow h-80"></div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow h-80"></div>
        </div>
      </div>
    );
  }

  const COLORS = ['#6366F1', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  const categoryData = analytics?.categoryBreakdown?.slice(0, 6).map((item, index) => ({
    name: item._id,
    value: item.total,
    color: COLORS[index % COLORS.length]
  })) || [];

  const monthlyData = analytics?.monthlyTrends?.slice(0, 6).map(item => ({
    month: `${item._id.month}/${item._id.year}`,
    amount: item.total
  })).reverse() || [];

  const insights = analytics?.insights || {};
  const spendingTrend = parseFloat(insights.spendingTrend) || 0;

  const cards = [
    {
      title: 'Total Expenses',
      value: `₹${analytics?.totalExpenses?.total?.toFixed(2) || '0.00'}`,
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      change: spendingTrend,
      changeType: spendingTrend > 0 ? 'increase' : 'decrease'
    },
    {
      title: 'This Month',
      value: `₹${analytics?.monthlyExpenses?.total?.toFixed(2) || '0.00'}`,
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      subtitle: `${analytics?.monthlyExpenses?.count || 0} transactions`
    },
    {
      title: 'Top Category',
      value: analytics?.topCategory || 'None',
      icon: Tag,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      subtitle: `₹${categoryData[0]?.value?.toFixed(2) || '0.00'}`
    },
    {
      title: 'Avg Daily Spend',
      value: `₹${insights.avgDailySpend?.toFixed(2) || '0.00'}`,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
      subtitle: 'This month'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back! Here's your financial overview.
          </p>
        </div>
        <Link
          to="/expenses"
          className="bg-primary text-white px-6 py-3 rounded-xl flex items-center space-x-2 hover:bg-primary/90 transition-colors shadow-lg"
        >
          {/* <Plus className="w-5 h-5" /> */}
          <span>Add New Expense</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-xl ${card.bgColor}`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
              {card.change && (
                <div className={`flex items-center space-x-1 text-sm font-medium ${
                  card.changeType === 'increase' ? 'text-red-600' : 'text-green-600'
                }`}>
                  {card.changeType === 'increase' ? 
                    <ArrowUpRight className="w-4 h-4" /> : 
                    <ArrowDownRight className="w-4 h-4" />
                  }
                  <span>{Math.abs(card.change)}%</span>
                </div>
              )}
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {card.title}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {card.value}
              </p>
              {card.subtitle && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {card.subtitle}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Spending by Category
            </h3>
            <Link 
              to="/analytics" 
              className="text-primary hover:text-primary/80 text-sm font-medium"
            >
              View Details →
            </Link>
          </div>
          {categoryData.length > 0 ? (
            <div className="flex items-center space-x-6">
              <ResponsiveContainer width="60%" height={200}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-3">
                {categoryData.slice(0, 4).map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {category.name}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      ₹{category.value.toFixed(0)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-500">
              No spending data available
            </div>
          )}
        </div>

        {/* Monthly Trends */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Monthly Trends
            </h3>
            <Link 
              to="/analytics" 
              className="text-primary hover:text-primary/80 text-sm font-medium"
            >
              View Analytics →
            </Link>
          </div>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={monthlyData}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis hide />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#6366F1" 
                  strokeWidth={3}
                  dot={{ fill: '#6366F1', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-500">
              No trend data available
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Expenses */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Expenses
            </h3>
            <Link 
              to="/expenses" 
              className="text-primary hover:text-primary/80 text-sm font-medium"
            >
              View All →
            </Link>
          </div>
          {recentExpenses.length > 0 ? (
            <div className="space-y-4">
              {recentExpenses.map((expense) => (
                <div key={expense._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Tag className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {expense.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {expense.category} • {new Date(expense.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ₹{expense.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No recent expenses</p>
            </div>
          )}
        </div>

        {/* Quick Actions & Insights */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link
                to="/expenses"
                className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                <Plus className="w-5 h-5 text-blue-600" />
                <span className="text-blue-600 font-medium">Add Expense</span>
              </Link>
              <Link
                to="/budgets"
                className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
              >
                <Target className="w-5 h-5 text-green-600" />
                <span className="text-green-600 font-medium">Set Budget</span>
              </Link>
              <Link
                to="/analytics"
                className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
              >
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <span className="text-purple-600 font-medium">View Analytics</span>
              </Link>
            </div>
          </div>

          {/* Insights */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Smart Insights
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      Predicted Next Month
                    </p>
                    <p className="text-lg font-bold text-blue-600">
                      ₹{insights.predictedNextMonth?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                </div>
              </div>
              
              {spendingTrend !== 0 && (
                <div className={`p-4 rounded-lg ${
                  spendingTrend > 0 
                    ? 'bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20' 
                    : 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20'
                }`}>
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                      spendingTrend > 0 ? 'text-red-600' : 'text-green-600'
                    }`} />
                    <div>
                      <p className={`text-sm font-medium ${
                        spendingTrend > 0 
                          ? 'text-red-900 dark:text-red-100' 
                          : 'text-green-900 dark:text-green-100'
                      }`}>
                        Spending Trend
                      </p>
                      <p className={`text-lg font-bold ${
                        spendingTrend > 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {spendingTrend > 0 ? '+' : ''}{spendingTrend}%
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;