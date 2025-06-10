# Trakr - Subscription Tracker Web App

**Trakr** is a modern web application that helps users track, manage, and visualize their recurring subscriptions. It allows users to monitor their monthly spending, stay informed about upcoming payments, and discover where they can save money.


## Features
- **Authentication** with Email/Password and Google via Firebase
- **Add/Edit/Delete Subscriptions** with fields: name, category, billing period, cost, and next payment date
- **Track Subscription Details** with a responsive table and filters
- **Visual Insights**:
    - Cards displaying total subscriptions, average cost, and more
    - Pie chart showing category distribution
    - Bar chart showing total monthly cost by catergory
- **User Specific Firestore Storage**: Each user sees only their own data
- **Routing** with protected access to the dashboard after login


## Tech Stack

### Frontend
- **React** - UI Framework
- **React Router** - For client-side routing
- **Firebase Auth** - user login, sign-up, and session management
- **Firebase Firestore** - cloud database for user subscription data
- **HTML/CSS** - for clean and flexible styling

### Dev Tools
- **Create React App (CRA)** - For bootstrapping the React App
- **React Hooks** - For state and effect management
- **Netlify** - For deployment


## Future Enhancements
- Payment Reminders via email
- Subscription import from bank data or emails
- Premium Tier for smarter insights


## Author
Made by Dylan Giletto
[Portfolio](https://portfolio-dgilettos-projects.vercel.app/) | [LinkedIn](https://www.linkedin.com/in/dylan-giletto-775789269/) | [Github](https://github.com/dgiletto)

Link to the Web App: https://subscription-trakr.netlify.app/
