# FinTrack - Modern Finance Dashboard

A professional-grade finance dashboard for tracking transactions, visualizing spending patterns, and managing budgets with a focus on premium aesthetics and responsive design.

---

### 🚀 Tech Stack

| Technology      | Description                               |
| :-------------- | :---------------------------------------- |
| **React 18**    | Component-based UI framework              |
| **Vite**        | Ultra-fast build tool and dev server      |
| **Zustand**     | Lightweight, persistent state management  |
| **Tailwind v4** | Utility-first CSS with 3D and transitions |
| **Recharts**    | Functional and responsive data viz        |
| **date-fns**    | Modern JavaScript date utility            |
| **Lucide React**| Beautiful & consistent iconography        |
| **Papa Parse**  | Powerful CSV parser for exports           |

---

### 🛠️ Setup Instructions

1.  **Clone the repository** (or download the project files).
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Run in development**:
    ```bash
    npm run dev
    ```
4.  **Open locally**: Navigate to `http://localhost:5173` in your browser.

---

### ✨ Core Features

*   **Real-time Summary:** Instantly view Total Balance, Total Income, and Total Expenses.
*   **Balance Trend:** 30-day interactive line chart showing your running net balance.
*   **Spending Breakdown:** Categories donut chart for analyzing where your money goes.
*   **Transaction Management:**
    *   **Filters:** Search by description, filter by category/type.
    *   **Sorting:** Sort by Date or Amount (asc/desc).
    *   **Export:** Download your filtered transaction history as a CSV file.
*   **AI-Powered Insights:** Monthly trend analysis, savings rate calculation, and top expense category identification.
*   **Customization:** Full dark mode support with system preference persistence.

---

### 🌟 Additional Features by **Keshav Sharma**

*   🌍 **Multi-Language Support:** Seamlessly switch between **English**, **Hindi**, **Spanish**, and **Dutch** directly from the header. The entire UI—from navigation and card labels to action buttons—localizes instantly.
*   📊 **Dynamic GroupBy:** Elevate your transaction analysis by grouping your data by **Date** or **Category**. This feature includes sticky-style sub-headers that provide a clear summary of transaction counts per group.

---

### 📂 Folder Structure

```text
src/
├── components/          # Reusable UI components
│   ├── dashboard/       # Charts & Summary cards
│   ├── layout/          # Sidebar, Header, and Shared Layout
│   ├── insights/        # AI-powered insights section
│   └── transactions/    # Table, Filters, and Add/Edit Modals
├── store/               # Zustand central state management
├── utils/               # Formatting and translation helpers
├── data/                # Mock data generators
├── App.jsx              # Main router and page logic
└── index.css            # Global design system & Tailwind v4
```

---

### 🧠 State Management

The project uses **Zustand** as its backbone for state management. 
*   **Persistent Storage:** Uses the `persist` middleware to automatically sync all user data (transactions, theme preference, role, and language) with `localStorage`.
*   **Centralized Source of Truth:** All CRUD operations for transactions and global filter states are managed centrally in `useStore.js`.

---

### 🛡️ Role-Based UI

FinTrack includes a **Role-Based Access Control (RBAC)** simulator to demonstrate enterprise-grade security:
1.  **Viewer (Default):** Can view tables and charts but cannot perform destructive actions.
2.  **Admin:** Unlocks the **Add Transaction**, **Edit**, **Delete**, and **Export to CSV** buttons.

> **How to switch roles:** Simply use the role selector (Eye/Shield icon) in the top-right corner of the desktop header or the header bar on mobile.

---

### 👤 Author
**Project refined and enhanced by Keshav Sharma**
*   *Implemented localization system & dynamic data grouping.*
