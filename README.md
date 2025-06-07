# RO Plant Management System

A comprehensive business management system for RO (Reverse Osmosis) plant operations, featuring sales tracking, expense management, customer records, and financial reporting.

## 🚀 Features

### Core Functionality
- **Admin/Staff Authentication** - Secure login system with JWT tokens
- **Customer Management** - Complete customer database with purchase history
- **Sales Tracking** - Daily sales recording with unit tracking and profit calculations
- **Expense Management** - Categorized expense tracking with detailed reporting
- **Creditors Management** - Bill tracking with payment status and due date alerts
- **Financial Reports** - Comprehensive analytics and profit/loss statements

### Technical Features
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Real-time Updates** - Live dashboard with key business metrics
- **Data Export** - Generate reports for accounting and analysis
- **Secure Backend** - MongoDB with proper authentication and validation

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Custom CSS** with modern design principles
- **React Router** for navigation
- **Axios** for API communication
- **Chart.js** for data visualization
- **Date-fns** for date handling

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcrypt** for password hashing
- **CORS** enabled for cross-origin requests

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables:
   ```
   VITE_API_URL=https://your-api-domain.vercel.app/api
   ```
3. Deploy automatically on push to main branch

### Backend (Vercel)
1. The API is included in the same repository under `/api`
2. Set environment variables in Vercel:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ro-plant
   JWT_SECRET=your-super-secret-key
   ```
3. Vercel will automatically deploy the API as serverless functions

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Add your connection string to environment variables
4. Whitelist Vercel's IP addresses or use 0.0.0.0/0 for development

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ro-plant-management-system
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd api
   npm install
   cd ..
   ```

4. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   ```

5. **Start the development servers**
   
   Backend (Terminal 1):
   ```bash
   cd api
   npm run dev
   ```
   
   Frontend (Terminal 2):
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## 🔐 Default Login Credentials

```
Username: admin
Password: admin123
```

**Important:** Change these credentials immediately after first login in a production environment.

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token

### Customers
- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create new customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Sales
- `GET /api/sales` - Get sales (with date filter)
- `POST /api/sales` - Record new sale
- `PUT /api/sales/:id` - Update sale
- `DELETE /api/sales/:id` - Delete sale

### Expenses
- `GET /api/expenses` - Get expenses (with date filter)
- `POST /api/expenses` - Add new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Creditors
- `GET /api/creditors` - Get all creditors
- `POST /api/creditors` - Add new creditor
- `PUT /api/creditors/:id` - Update creditor
- `PATCH /api/creditors/:id/pay` - Mark as paid
- `DELETE /api/creditors/:id` - Delete creditor

### Reports
- `GET /api/reports/dashboard` - Dashboard statistics
- `GET /api/reports/sales` - Sales reports
- `GET /api/reports/expenses` - Expense reports
- `GET /api/reports/profit` - Profit analysis

## 🎨 Design System

### Color Palette
- **Primary Blue**: #2563eb (Buttons, links, accents)
- **Secondary Teal**: #0d9488 (Secondary actions, highlights)
- **Success Green**: #059669 (Positive metrics, success states)
- **Warning Orange**: #d97706 (Warnings, pending states)
- **Danger Red**: #dc2626 (Errors, negative metrics)
- **Neutral Grays**: #64748b, #94a3b8, #cbd5e1 (Text, borders)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: 700 weight, 120% line height
- **Body Text**: 400 weight, 150% line height
- **UI Elements**: 500 weight

### Spacing System
- **Base Unit**: 8px
- **Scale**: 0.5rem, 1rem, 1.5rem, 2rem, 3rem, 4rem

## 🔧 Configuration

### Environment Variables

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
```

#### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/ro-plant-management
JWT_SECRET=your-super-secret-jwt-key-here
PORT=3001
```

### MongoDB Collections
- **users** - Admin/staff authentication
- **customers** - Customer information and history
- **sales** - Daily sales records
- **expenses** - Business expenses by category
- **creditors** - Bills and payment tracking

## 📱 Mobile Responsiveness

The application is fully responsive with breakpoints at:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

Key mobile optimizations:
- Collapsible sidebar navigation
- Touch-friendly buttons and forms
- Optimized table layouts with horizontal scroll
- Simplified card layouts for small screens

## 🔒 Security Features

- **JWT Authentication** with 24-hour expiration
- **Password Hashing** using bcrypt with salt rounds
- **Input Validation** on all API endpoints
- **CORS Protection** with configurable origins
- **SQL Injection Prevention** through Mongoose ODM
- **XSS Protection** through proper data sanitization

## 📈 Performance Optimizations

- **Code Splitting** with React.lazy for route-based splitting
- **Image Optimization** using external CDN links
- **Efficient Re-renders** with React.memo and useCallback
- **Database Indexing** on frequently queried fields
- **Compression** enabled for API responses

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check your MongoDB URI in environment variables
   - Ensure MongoDB service is running (local) or accessible (Atlas)
   - Verify network connectivity and firewall settings

2. **JWT Token Errors**
   - Ensure JWT_SECRET is set in environment variables
   - Check token expiration (24 hours by default)
   - Clear localStorage and login again

3. **CORS Errors**
   - Verify API URL in frontend environment variables
   - Check CORS configuration in backend
   - Ensure proper protocol (http/https) matching

4. **Build Failures**
   - Clear node_modules and reinstall dependencies
   - Check Node.js version compatibility (18+)
   - Verify all environment variables are set

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the troubleshooting section above
- Review the API documentation

---

**Built with ❤️ for efficient RO plant management**