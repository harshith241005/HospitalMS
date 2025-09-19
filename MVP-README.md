# 🏥 Hospital Management System - MVP

## 🎯 **MVP Overview**

A complete Hospital Management System with role-based dashboards for **Patients**, **Doctors**, and **Admins**. Built with modern tech stack and realistic sample data.

### **🔹 Core Features Implemented**

#### **Patient Dashboard**
- ✅ View personal appointments (upcoming, completed, pending)
- ✅ Access medical reports and prescriptions
- ✅ Book new appointments with available doctors
- ✅ View consultation history and fees
- ✅ Personal health overview with stats

#### **Doctor Dashboard**
- ✅ Manage daily appointment schedule
- ✅ Accept/decline appointment requests
- ✅ View assigned patients and medical history
- ✅ Track consultation statistics
- ✅ Today's schedule with patient details

#### **Admin Dashboard**
- ✅ Hospital overview with key metrics
- ✅ Department-wise statistics and doctor count
- ✅ Room occupancy and availability tracking
- ✅ Appointment trends and analytics
- ✅ Recent hospital activities monitoring

---

## 🏗️ **Architecture & Tech Stack**

### **Frontend (Next.js 14)**
```
📁 frontend/
├── 📁 src/app/(dashboard)/
│   ├── 📄 dashboard/page.tsx     # Patient Dashboard
│   ├── 📄 doctor/page.tsx        # Doctor Dashboard  
│   └── 📄 admin/page.tsx         # Admin Dashboard
├── 📁 src/components/dashboard/
│   ├── 📁 patient/PatientDashboard.tsx
│   ├── 📁 doctor/DoctorDashboard.tsx
│   └── 📁 admin/AdminDashboard.tsx
└── 📁 src/components/auth/
    └── 📄 login-form.tsx         # JWT-based login
```

### **Backend (Node.js + Express + MongoDB)**
```
📁 backend/
├── 📁 models/
│   ├── 📄 User.js               # Patients, Doctors, Admins
│   ├── 📄 Appointment.js        # Appointment management
│   ├── 📄 Report.js             # Medical reports
│   ├── 📄 Department.js         # Hospital departments
│   ├── 📄 Room.js               # Room management
│   └── 📄 Service.js            # Hospital services
├── 📁 controllers/
│   ├── 📄 dashboardController.js # Role-based dashboards
│   └── 📄 authController.js     # Authentication
├── 📁 routes/
│   ├── 📄 dashboardRoutes.js    # Dashboard APIs
│   └── 📄 authRoutes.js         # Auth APIs
└── 📁 scripts/
    └── 📄 importSampleData.js   # Sample data import
```

---

## 🔗 **Data Flow & Relationships**

### **Interconnected Models**
```
👤 Users (Patients, Doctors, Admins)
    ↓
📅 Appointments ←→ 👨‍⚕️ Doctors
    ↓
📋 Reports ←→ 💊 Prescriptions
    ↓
🏥 Departments ←→ 🛏️ Rooms ←→ 🔧 Services
```

### **Role-Based Access**
- **Patient**: Can book appointments, view reports, manage profile
- **Doctor**: Can manage appointments, create reports, view assigned patients  
- **Admin**: Can manage all users, view hospital stats, oversee operations

---

## 🚀 **Quick Start Guide**

### **1. Backend Setup**
```bash
cd backend
npm install
npm run import-data    # Import sample data to MongoDB
npm start             # Start server on port 5000
```

### **2. Frontend Setup**
```bash
cd frontend
npm install
npm run dev          # Start Next.js on port 3000
```

### **3. Test Login Credentials**

#### **Demo Accounts (No API Call)**
```javascript
// Admin (Hospital Owner)
email: "harshithboyina@gmail.com"
password: "harshith@#123"
→ Redirects to /admin

// Doctor  
email: "doctor@hospital.com"
password: "12345678"
→ Redirects to /doctor

// Patient
email: "patient@hospital.com"
password: "12345678"
→ Redirects to /dashboard
```

#### **Real Database Accounts (API Call)**
```javascript
// After running npm run import-data

// Patients
email: "ravi.kumar@example.com"
email: "priya.sharma@example.com"
password: "password123" (for all)

// Doctors
email: "aditi.sharma@hms.com"  
email: "ramesh.verma@hms.com"
password: "doctor123" (for all)

// Admin (Hospital Owner)
email: "harshithboyina@gmail.com"
password: "harshith@#123"
```

---

## 📊 **Sample Data Included**

### **Realistic Hospital Data**
- **8 Patients** with medical history, appointments, reports
- **7 Doctors** across specializations (Cardiology, Neurology, Pediatrics, etc.)
- **6 Admins** with different roles and permissions
- **9 Appointments** with various statuses and types
- **7 Medical Reports** with prescriptions and recommendations
- **8 Departments** with services and equipment
- **8 Room Types** with occupancy and amenities
- **8 Hospital Services** with costs and availability

### **Data Relationships**
All data is properly interconnected:
- Patients linked to their appointments and reports
- Doctors assigned to departments and patients
- Appointments connected to reports and prescriptions
- Hospital info (departments, rooms, services) properly structured

---

## 🔧 **API Endpoints**

### **Authentication**
```
POST /api/auth/login          # Login with email/password
POST /api/auth/register       # Register new user
GET  /api/auth/profile        # Get user profile
```

### **Dashboard APIs**
```
GET /api/dashboard/patient    # Patient dashboard data
GET /api/dashboard/doctor     # Doctor dashboard data  
GET /api/dashboard/admin      # Admin dashboard data
GET /api/dashboard/hospital-overview  # Public hospital info
```

### **Appointment Management**
```
POST /api/dashboard/patient/book-appointment     # Book appointment
PATCH /api/dashboard/doctor/appointment/:id/status  # Update status
```

---

## 📱 **Dashboard Features**

### **Patient Dashboard**
- 📊 **Stats Cards**: Total appointments, completed, upcoming, reports
- 📅 **Upcoming Appointments**: Next scheduled visits with doctor details
- 📋 **Recent Reports**: Latest medical reports and prescriptions
- 📈 **Health Overview**: Personal medical history and trends

### **Doctor Dashboard**  
- 👥 **Patient Stats**: Total patients, today's appointments, completed consultations
- 📅 **Today's Schedule**: Detailed appointment list with patient info
- ⏳ **Pending Requests**: New appointment requests to approve/decline
- 👤 **Recent Patients**: Patient list with medical history

### **Admin Dashboard**
- 🏥 **Hospital Overview**: Patients, doctors, departments, room occupancy
- 📊 **Department Stats**: Doctor count and bed capacity by department
- 🛏️ **Room Management**: Occupancy status by room type
- 📈 **Trends**: Monthly appointment trends and analytics
- 🔄 **Recent Activities**: Latest system activities and updates

---

## 🔐 **Security Features**

- ✅ **JWT Authentication**: Secure token-based login
- ✅ **Role-Based Access**: Route protection by user role
- ✅ **Password Hashing**: bcrypt for secure password storage
- ✅ **Input Validation**: Express validator for API security
- ✅ **CORS Protection**: Cross-origin request security

---

## 🎨 **UI/UX Features**

- ✅ **Responsive Design**: Mobile-first with Tailwind CSS
- ✅ **Dark/Light Mode**: Theme switching support
- ✅ **Modern Components**: Radix UI + shadcn/ui components
- ✅ **Loading States**: Proper loading and error handling
- ✅ **Toast Notifications**: User feedback for actions
- ✅ **Role-Based Navigation**: Dynamic sidebar based on user role

---

## 📋 **Next Steps (Post-MVP)**

### **Phase 2 Enhancements**
- 💳 **Billing & Payments**: Invoice generation and payment processing
- 📧 **Notifications**: Email/SMS reminders for appointments
- 📊 **Advanced Analytics**: Detailed reports and insights
- 🔍 **Search & Filters**: Advanced search across all modules
- 📱 **Mobile App**: React Native mobile application

### **Phase 3 Features**
- 🤖 **AI Integration**: Symptom checker and diagnosis assistance
- 📹 **Telemedicine**: Video consultation integration
- 🏥 **Multi-Hospital**: Support for hospital chains
- 📈 **Business Intelligence**: Advanced analytics dashboard
- 🔗 **Third-Party Integrations**: Lab systems, pharmacy, insurance

---

## 🛠️ **Development Commands**

```bash
# Backend
npm start              # Production server
npm run dev           # Development with nodemon
npm run import-data   # Import sample data
npm test             # Run API tests

# Frontend  
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # Code linting
```

---

## 📞 **Support & Documentation**

- **Sample Data**: `/sample-data/` directory with JSON files
- **API Documentation**: Test endpoints in `/backend/test-endpoints.rest`
- **Component Library**: shadcn/ui components in `/frontend/src/components/ui/`
- **Database Schema**: MongoDB models in `/backend/models/`

---

## 🎉 **MVP Status: COMPLETE**

✅ **Authentication System** - JWT-based with role management  
✅ **Patient Module** - Dashboard, appointments, reports  
✅ **Doctor Module** - Patient management, schedule, requests  
✅ **Admin Module** - Hospital overview, analytics, management  
✅ **Database Models** - Complete schema with relationships  
✅ **Sample Data** - Realistic hospital data for testing  
✅ **API Integration** - Full backend-frontend connectivity  
✅ **Responsive UI** - Modern, accessible interface  

**Ready for production deployment and further enhancements!** 🚀
