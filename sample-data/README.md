# Hospital Management System - Sample Data

This directory contains comprehensive sample data for the Hospital Management System (HMS) to populate both frontend UI and backend database.

## 📁 Data Files Overview

### 1. **patients.json** (8 entries)
Complete patient records with:
- Personal information (name, email, phone, address)
- Medical details (age, gender, blood group, medical history)
- Emergency contacts
- Linked appointments and reports
- Authentication credentials (hashed passwords)

### 2. **doctors.json** (7 entries)
Detailed doctor profiles including:
- Professional information (specialization, experience, qualifications)
- Contact details and clinic information
- Availability schedules and consultation fees
- Patient assignments and ratings
- License numbers and languages spoken

### 3. **appointments.json** (9 entries)
Appointment records linking patients and doctors:
- Scheduled, confirmed, completed, and pending appointments
- Appointment types (consultation, follow-up, routine checkup)
- Symptoms, reasons, and consultation fees
- Payment status and appointment notes

### 4. **reports.json** (7 entries)
Comprehensive medical reports containing:
- Diagnosis and symptoms
- Vital signs and test results
- Detailed prescriptions with dosages
- Medical recommendations
- Follow-up appointments

### 5. **hospital-info.json**
Complete hospital information including:
- Hospital details and contact information
- 8 departments with services and equipment
- 8 different room types with amenities
- 8 hospital services with costs
- Facilities and operating hours

### 6. **admins.json** (6 entries)
Administrative staff records with:
- Role-based permissions
- Department assignments
- Employee information and contact details
- System access levels

## 🔗 Data Relationships

The sample data is interconnected with proper foreign key relationships:

```
Patients ←→ Appointments ←→ Doctors
    ↓           ↓
  Reports ←→ Appointments
    ↓
Prescriptions
```

## 📊 Data Statistics

- **Total Patients**: 8 (various ages, conditions, locations in Hyderabad/Telangana)
- **Total Doctors**: 7 (covering major specializations)
- **Total Appointments**: 9 (different statuses and types)
- **Total Reports**: 7 (comprehensive medical records)
- **Total Admins**: 6 (different roles and permissions)
- **Departments**: 8 (major hospital departments)
- **Room Types**: 8 (from general ward to deluxe suite)
- **Services**: 8 (emergency, pharmacy, lab, etc.)

## 🏥 Hospital Context

All data is set in **Hyderabad, Telangana** with:
- Realistic Indian names and phone numbers
- Local addresses and pincodes
- Indian medical practices and medications
- Appropriate consultation fees in INR

## 💾 Usage Instructions

### For Backend (MongoDB):
1. Import each JSON file into corresponding MongoDB collections
2. Ensure proper indexing on `_id`, `email`, and foreign key fields
3. Validate data relationships before importing

### For Frontend (React/Next.js):
1. Use as placeholder data for UI components
2. Replace API calls with local data during development
3. Test different user roles and scenarios

### Sample Login Credentials:
```javascript
// Patients
email: "ravi.kumar@example.com", password: "password123"
email: "priya.sharma@example.com", password: "password123"

// Doctors  
email: "aditi.sharma@hms.com", password: "doctor123"
email: "ramesh.verma@hms.com", password: "doctor123"

// Admins
email: "admin@hms.com", password: "admin123"
email: "priya.admin@hms.com", password: "admin123"
```

## 🔧 Customization

To modify the data:
1. Update MongoDB ObjectIds to maintain relationships
2. Adjust dates to current/future dates as needed
3. Modify contact information and addresses
4. Update medical conditions and prescriptions as required

## 📋 Data Validation

All sample data includes:
- ✅ Valid email formats
- ✅ Proper phone number formats (+91-XXXXXXXXXX)
- ✅ Realistic medical conditions and treatments
- ✅ Appropriate age groups and demographics
- ✅ Consistent foreign key relationships
- ✅ Proper date/time formats (ISO 8601)

This sample data provides a solid foundation for testing and demonstrating the complete Hospital Management System functionality.
