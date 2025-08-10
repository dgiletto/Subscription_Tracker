# Trackr - Subscription Management App

A modern, full-stack web application for tracking and managing your recurring subscriptions. Built with React, Node.js, Express, MongoDB, and Firebase Authentication.

![Dashboard Preview](./client/src/Images/dashboard.png)

## 🌟 Features
### 📊 Dashboard Analytics
- **Comprehensive Analytics:** Track total subscriptions, average costs, and monthly spending
- **Visual Charts:** Interactive pie charts and bar charts showing category breakdown
- **Cost Analysis:** View spending patterns across different subscription categories

### 💼 Subscription Management
- **Add Subscriptions:** Easy-to-use modal for adding new subscriptions
- **Edit & Delete:** Inline editing with intuitive controls
- **Categorization:** Organize subscriptions by Entertainment, Productivity, Health & Fitness, and more
- **Billing Periods:** Support for weekly, monthly, and yearly billing cycles

### 🔍 Filtering & Sorting
- **Category Filters:** Filter subscriptions by category
- **Billing Period Filters:** View subscriptions by billing frequency
- **Sorting Options:** Sort by name, cost, or next payment date
- **Real-Time Updates:** Automatic payment date calculations

### 🔐 Authentication
- **Firebase Auth:** Secure authentication with Google OAuth and email/password
- **Protected Routes:** User-specific data with secure API endpoints
- **Session Management:** Persistent login state across browser sessions

## 🛠️ Tech Stack
### Frontend
- **React 18:** Modern UI library with hooks
- **React Router:** Client-side routing
- **Recharts:** Interactive data visualization
- **Lucide React:** Beautiful icon library
- **CSS3:** Custom styling with animations and responsive design

### Backend
- **Node.js:** Javascript runtime
- **Express.js:** Web application framework
- **MongoDB:** NoSQL database with Mongoose ODM
- **Firebase Admin SDK:** Authentication and authorization

### Authentication & Security
- **Firebase Authentication:** User management and OAuth
- **JWT Token Verification:** Secure API endpoints
- **CORS:** Cross-origin resource sharing configuration

## Project Structure
```bash
subscription-tracker/
├── client/                     # React frontend
│   ├── src/
│   │   ├── Components/         # Reusable UI components
│   │   │   ├── AddSubscriptionModal.jsx
│   │   │   ├── Carousel.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── SubscriptionTable.jsx
│   │   ├── Pages/              # Main page components
│   │   │   ├── Dashboard.jsx
│   │   │   └── Home.jsx
│   │   ├── Images/             # Static assets
│   │   └── firebase.js         # Firebase configuration
│   └── public/
├── server/                     # Node.js backend
│   ├── controllers/            # Route handlers
│   │   ├── paymentController.js
│   │   └── userController.js
│   ├── models/                 # Database schemas
│   │   └── User.js
│   ├── routes/                 # API routes
│   │   └── userRoutes.js
│   ├── middleware/             # Custom middleware
│   │   └── auth.js
│   ├── lib/                    # Utility functions
│   │   ├── db.js
│   │   └── paymentCalculator.js
│   └── server.js               # Express app entry point
└── README.md
```

## 🔧 API Endpoints
### Authentication Required (Bearer Token)
| Method | Endpoint                       | Description                  |
| -----  | -----                          | -----                        |
| GET    | /api/auth/subscriptions        | Get user's subscriptions     |
| POST   | /api/auth/subscriptions        | Add new subscription         |
| PUT    | /api/auth/subscriptions/:subId | Update subscription          |
| DELETE | /api/auth/subscriptions/:subId | Delete subscription          |
| POST   | /api/auth/update-payments      | Update overdue payment dates |

### Public Endpoints
| Method | Endpoint                       | Description                  |
| -----  | -----                          | -----                        |
| GET    | /api/status                    | Server health check          |

## 💾 Database Schema
### User Model
```javascript
{
  uid: String,              // Firebase user ID
  subscriptions: [          // Array of subscription objects
    {
      name: String,         // Subscription service name
      category: String,     // Category (Entertainment, Productivity, etc.)
      billingPeriod: String,// Weekly, Monthly, or Yearly
      cost: Number,         // Subscription cost
      nextPayment: Date,    // Next payment due date
      createdAt: Date       // Subscription creation date
    }
  ]
}
```

## ⚡ Key Features Deep Dive
### Automatic Payment Updates
The app automatically calculates and updates subscription payment dates when they become overdue, ensuring your tracking stays current.

### Smart Analytics
- **Monthly Cost Normalization:** All costs are normalized to monthly equivalents for accurate comparison
- **Category Insights:** Visual breakdown of spending by subscription category
- **Cost Distribution:** Identify your most and least expensive subscriptions

## Modern UI/UX
- **Smooth Animations:** CSS transitions and keyframe animations
- **Interactive Charts:** Hover effects and active states on data visualizations
- **Responsive Tables:** Mobile-optimized subscription management
- **Modal Dialogs:** Clean, accessible forms for adding subscriptions

## Author
Made by Dylan Giletto
[Portfolio](https://portfolio-dgilettos-projects.vercel.app/) | [LinkedIn](https://www.linkedin.com/in/dylan-giletto-775789269/) | [Github](https://github.com/dgiletto)

Link to the Web App: https://subscription-trakr.netlify.app/

## Support
For support, please open an issue on GitHub or contact dgiletto10@gmail.com
