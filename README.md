# ZORVYN Finance System 🚀

A professional-grade, full-stack financial data processing and access control system. Built with a **premium dark-mode aesthetic**, this platform provides safe, role-based management of financial records with real-time analytics.

---

## 💎 Premium Features

### 🔐 Multi-Tier Authorization (RBAC)
- **Admin**: Full system control. Manage users (promote/demote/delete), create/update/delete financial records, and access full analytics.
- **Analyst**: Data-driven access. View all financial records and perform trend analysis without administrative overhead.
- **Viewer**: Read-only dashboard. Access high-level summaries and expense distributions safely.

### 📊 Intelligent Analytics Dashboard
- **Trend Analysis**: Toggle between **Monthly** and **Weekly** financial performance views using dynamic BarCharts.
- **Expense Distribution**: Visual breakdown of spending categories using interactive PieCharts.
- **Recent Activity**: A real-time audit log (Admin-only) showing who created what transaction and when.

### ✨ State-of-the-Art UX/UI
- **React Hot Toast**: Instant, color-coded notifications with loading states for every action (Add, Delete, Login).
- **Glassmorphism Modals**: Custom-designed confirmation popups for destructive actions (Delete Record/User), replacing invasive browser alerts.
- **Advanced Filtering**: Targeted search by **Category (Fuzzy Search)**, **Type**, and **Specific Date**.

---

## 🛠️ Tech Stack

### Backend
- **Node.js & Express.js**: High-performance API architecture.
- **MongoDB & Mongoose**: Flexible NoSQL data modeling.
- **JWT Authentication**: Secure, stateless session management.
- **Helmet & Rate Limiting**: Production-grade security headers and DDoS protection.

### Frontend
- **React 18 (Vite)**: Lightning-fast development and optimized production builds.
- **Tailwind CSS**: Modern utility-first styling for the premium "Dark Mode" look.
- **Lucide-React**: Sharp, consistent iconography.
- **Recharts**: Responsive and accessible data visualization.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas)

### 2. Environment Setup
Create a `.env` file in the root directory:
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/finance_db
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=30d
NODE_ENV=development
```

### 3. Installation
```bash
# Install Backend dependencies
npm install

# Install Frontend dependencies
cd frontend
npm install
```

### 4. Running the Application
```bash
# Terminal 1: Start Backend (Port 5001)
npm run dev

# Terminal 2: Start Frontend (Port 3000)
cd frontend
npm run dev
```

---

## 🔑 Admin Recovery
If you need to restore or create a primary Administrator account, use the built-in recovery script:
```bash
node -e "/* recovery logic */" # See documentation or run create_admin.js
```
**Default Recovery Credentials:** `admin@zorvyn.com` / `password123`

---

## 📂 Project Architecture
```text
.
├── controllers/        # Business logic & RBAC enforcement
├── middleware/         # Security, Auth, & Error Handling
├── models/             # Mongoose Schemas (User, Record)
├── routes/             # API Endpoints
└── frontend/
    ├── src/pages/      # Dashboard, Records, Users, Auth
    ├── src/components/ # Navbar, Shared UI
    └── src/context/    # Auth & State Management
```

---

## 📜 Contributing
This project is built for secure, scalable financial data management. Please ensure all new routes follow the `protect` and `authorize` middleware patterns.
