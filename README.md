# Expense Tracker - Full-Stack Application

A modern, responsive expense tracking application built with React, Node.js, Express, and MongoDB.

## 🚀 Features

- **Authentication & Security**: JWT-based auth with bcrypt password hashing
- **Expense Management**: Full CRUD operations with categorization
- **Analytics & Insights**: Interactive charts and spending analysis
- **Smart Filters**: Search, filter by category, date range
- **Dark/Light Mode**: Toggle between themes
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- React 19 + Vite
- Tailwind CSS
- React Router
- Axios
- Recharts
- Lucide React Icons

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcrypt
- Express Validator

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with your configuration:
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/smartspend
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here
NODE_ENV=development
```

4. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Expenses
- `GET /api/expenses` - Get expenses with filters
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/expenses/analytics` - Get analytics data

## 📱 Usage

1. Register a new account or login
2. Add expenses with categories and notes
3. View dashboard with summary cards
4. Analyze spending patterns in Analytics
5. Filter and search expenses
6. Toggle between dark/light themes

## 🏗️ Project Structure

```
smartspend-app/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── layouts/
    │   ├── pages/
    │   ├── services/
    │   └── utils/
    └── public/
```

## 🚀 Deployment

### Backend (Heroku/Railway)
1. Set environment variables
2. Deploy with MongoDB Atlas connection

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder

## 📊 Features Showcase

- **Dashboard**: Summary cards with total expenses, monthly spending, top categories
- **Expense Management**: Add, edit, delete expenses with rich filtering
- **Analytics**: Interactive pie charts and bar graphs for spending insights
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark Mode**: Professional dark theme for better user experience

## 🔐 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Protected API routes
- Input validation and sanitization
- CORS configuration

## 📈 Resume Points

- Full-stack MERN application with modern React patterns
- RESTful API design with Express.js
- MongoDB aggregation for analytics
- JWT authentication implementation
- Responsive UI with Tailwind CSS
- Chart visualization with Recharts
- State management with Context API
- Protected routes and middleware

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.