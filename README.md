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
- **Self-Service Profiling**: Users can securely update their own **Display Name** and **Password** (requires current password verification for safety).
- **Self-Service Profiling**: Users can securely update their own **Display Name** and **Password** (requires current password verification for safety).

---

## ⚙️ Assumptions & Tradeoffs

To ensure the system remained focus on core functionality and security, the following design decisions were made:

- **Single Admin Policy**: For this version, the system enforces a "single administrator" rule to simplify high-level permissions and prevent accidental lockout of the entire system.
- **Role-Based Visibility**: Unlike typical SaaS platforms where users see only 'their' data, this is designed for a **Finance Team** environment. Analysts can see all records to perform cross-functional trend analysis, while Viewers only see aggregated dashboard data.
- **Hard Deletes vs Soft Deletes**: We chose **Hard Deletes** for this evaluation to maintain database cleanliness. In a production auditing system, we would transition to soft-deletes (isDeleted: Boolean) to preserve historical logs.
- **Stateful Validation**: Password strength is enforced both in the API layer (express-validator) and the Model layer (Mongoose 9 hooks) to ensure data integrity even if the API is bypassed.

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

## 📡 API Reference

### 🔐 Authentication
| Endpoint | Method | Access | Description |
|---|---|---|---|
| `/api/auth/register` | POST | Public | Create a new user account |
| `/api/auth/login` | POST | Public | Authenticate and receive JWT |
| `/api/auth/me` | GET | Private | Get current user's profile |
| `/api/auth/profile` | PUT | Private | Update name or password |

### 📊 Dashboard & Records
| Endpoint | Method | Access | Description |
|---|---|---|---|
| `/api/dashboard/summary` | GET | All Roles | Aggregated financial analytics |
| `/api/records` | GET | Analyst/Admin | List/Filter all records |
| `/api/records` | POST | Admin | Create a new financial record |
| `/api/records/:id` | PUT | Admin | Update an existing record |
| `/api/records/:id` | DELETE | Admin | Remove a record permanently |

### 👥 User Management
| Endpoint | Method | Access | Description |
|---|---|---|---|
| `/api/users` | GET | Admin | List all registered users |
| `/api/users/:id` | PUT | Admin | Update user role or status |
| `/api/users/:id` | DELETE | Admin | Remote a user account |

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
