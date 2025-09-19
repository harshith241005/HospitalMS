// Enhanced placeholder data for the Hospital Management System MVP
export const users = [
  {
    id: '1',
    name: 'Harshith Boyina',
    email: 'harshithboyina@gmail.com',
    role: 'admin' as const,
    avatarUrl: 'https://picsum.photos/seed/admin/200/200',
    dataAiHint: 'person' as const,
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    email: 'doctor@hospital.com',
    role: 'doctor' as const,
    avatarUrl: 'https://picsum.photos/seed/doctor/200/200',
    dataAiHint: 'person' as const,
  },
  {
    id: '3',
    name: 'John Smith',
    email: 'patient@hospital.com',
    role: 'patient' as const,
    avatarUrl: 'https://picsum.photos/seed/patient/200/200',
    dataAiHint: 'person' as const,
  },
];

// Comprehensive sample data as per MVP spec
export const doctors = [
  {"id":"D001","name":"Dr. Aditi Sharma","email":"aditi.sharma@hms.com","phone":"+91-9876543210","specialization":"Cardiology","departmentId":"DEP01","experience":12,"availability":[{"day":"Mon","slots":["10:00","11:00","14:00"]},{"day":"Wed","slots":["10:00","11:00","14:00"]}]},
  {"id":"D002","name":"Dr. Ramesh Verma","email":"ramesh.verma@hms.com","phone":"+91-9812345678","specialization":"Neurology","departmentId":"DEP02","experience":15,"availability":[{"day":"Tue","slots":["11:00","13:00","15:00"]}]},
  {"id":"D003","name":"Dr. Sneha Kapoor","email":"sneha.kapoor@hms.com","phone":"+91-9123456789","specialization":"Pediatrics","departmentId":"DEP03","experience":8,"availability":[{"day":"Mon","slots":["09:00","10:00"]},{"day":"Thu","slots":["09:00","10:00"]}]},
  {"id":"D004","name":"Dr. Vikram Singh","email":"vikram.singh@hms.com","phone":"+91-9988776655","specialization":"Orthopedics","departmentId":"DEP04","experience":10,"availability":[{"day":"Tue","slots":["14:00","16:00"]},{"day":"Sat","slots":["10:00"]}]},
  {"id":"D005","name":"Dr. Meera Joshi","email":"meera.joshi@hms.com","phone":"+91-9871203456","specialization":"Gynecology","departmentId":"DEP05","experience":14,"availability":[{"day":"Mon","slots":["10:00","12:00"]},{"day":"Fri","slots":["10:00","12:00"]}]},
  {"id":"D006","name":"Dr. Arjun Nair","email":"arjun.nair@hms.com","phone":"+91-9765432109","specialization":"Dermatology","departmentId":"DEP06","experience":7,"availability":[{"day":"Wed","slots":["13:00","15:00"]},{"day":"Thu","slots":["13:00"]}]}
];

export const patients = [
  {"id":"P001","name":"Rahul Mehta","email":"rahul.mehta@example.com","phone":"+91-9876501234","dob":"1993-04-05","gender":"Male","address":"Visakhapatnam, Andhra Pradesh","medicalHistory":["Hypertension"],"primaryDoctorId":"D001"},
  {"id":"P002","name":"Priya Reddy","email":"priya.reddy@example.com","phone":"+91-9823412345","dob":"1997-09-12","gender":"Female","address":"Vijayawada, Andhra Pradesh","medicalHistory":["Migraine"],"primaryDoctorId":"D002"},
  {"id":"P003","name":"Ankit Gupta","email":"ankit.gupta@example.com","phone":"+91-9911223344","dob":"1980-07-20","gender":"Male","address":"Tirupati, Andhra Pradesh","medicalHistory":["Diabetes"],"primaryDoctorId":"D005"},
  {"id":"P004","name":"Sanya Malhotra","email":"sanya.malhotra@example.com","phone":"+91-9988332211","dob":"2019-02-02","gender":"Female","address":"Guntur, Andhra Pradesh","medicalHistory":[],"primaryDoctorId":"D003"},
  {"id":"P005","name":"Vikash Yadav","email":"vikash.yadav@example.com","phone":"+91-9123009876","dob":"1973-01-15","gender":"Male","address":"Kakinada, Andhra Pradesh","medicalHistory":["Fracture history"],"primaryDoctorId":"D004"},
  {"id":"P006","name":"Neha Patel","email":"neha.patel@example.com","phone":"+91-9786541230","dob":"1991-06-18","gender":"Female","address":"Nellore, Andhra Pradesh","medicalHistory":["Eczema"],"primaryDoctorId":"D006"},
  {"id":"P007","name":"Suresh Kumar","email":"suresh.kumar@example.com","phone":"+91-9901122334","dob":"1965-11-11","gender":"Male","address":"Rajahmundry, Andhra Pradesh","medicalHistory":["COPD"],"primaryDoctorId":"D001"},
  {"id":"P008","name":"Lakshmi Devi","email":"lakshmi.devi@example.com","phone":"+91-9012345678","dob":"1988-03-27","gender":"Female","address":"Anantapur, Andhra Pradesh","medicalHistory":["PCOS"],"primaryDoctorId":"D005"}
];

export const appointments = [
  {"id":"A001","patientId":"P001","doctorId":"D001","date":"2025-09-20","time":"10:00","status":"PENDING","createdAt":"2025-09-16T08:00:00Z","reason":"Routine checkup"},
  {"id":"A002","patientId":"P002","doctorId":"D002","date":"2025-09-21","time":"11:00","status":"CONFIRMED","createdAt":"2025-09-16T09:00:00Z","reason":"Migraine follow-up"},
  {"id":"A003","patientId":"P003","doctorId":"D005","date":"2025-09-22","time":"10:30","status":"CONFIRMED","createdAt":"2025-09-15T07:30:00Z","reason":"Diabetes consultation"},
  {"id":"A004","patientId":"P004","doctorId":"D003","date":"2025-09-20","time":"09:00","status":"CONFIRMED","createdAt":"2025-09-14T10:00:00Z","reason":"Pediatric checkup"},
  {"id":"A005","patientId":"P005","doctorId":"D004","date":"2025-09-23","time":"14:00","status":"PENDING","createdAt":"2025-09-17T12:00:00Z","reason":"Fracture follow-up"},
  {"id":"A006","patientId":"P006","doctorId":"D006","date":"2025-09-24","time":"13:00","status":"PENDING","createdAt":"2025-09-17T13:00:00Z","reason":"Skin consultation"},
  {"id":"A007","patientId":"P007","doctorId":"D001","date":"2025-09-25","time":"11:30","status":"PENDING","createdAt":"2025-09-18T08:00:00Z","reason":"COPD monitoring"},
  {"id":"A008","patientId":"P008","doctorId":"D005","date":"2025-09-26","time":"10:00","status":"CONFIRMED","createdAt":"2025-09-18T09:00:00Z","reason":"PCOS treatment"},
  {"id":"A009","patientId":"P001","doctorId":"D001","date":"2025-10-02","time":"10:00","status":"PENDING","createdAt":"2025-09-18T10:00:00Z","reason":"Blood pressure check"},
  {"id":"A010","patientId":"P002","doctorId":"D002","date":"2025-10-03","time":"11:00","status":"PENDING","createdAt":"2025-09-18T11:00:00Z","reason":"Neurological assessment"}
];

export const reports = [
  {"id":"R001","patientId":"P003","doctorId":"D005","diagnosis":"Type 2 Diabetes - Follow-up","prescription":[{"medicine":"Metformin","dose":"500mg twice daily"}],"createdAt":"2025-09-12"},
  {"id":"R002","patientId":"P004","doctorId":"D003","diagnosis":"Acute Viral Fever","prescription":[{"medicine":"Paracetamol","dose":"500mg as needed"}],"createdAt":"2025-09-14"},
  {"id":"R003","patientId":"P001","doctorId":"D001","diagnosis":"Hypertension - monitoring","prescription":[{"medicine":"Amlodipine","dose":"5mg once daily"}],"createdAt":"2025-09-10"},
  {"id":"R004","patientId":"P006","doctorId":"D006","diagnosis":"Eczema treatment","prescription":[{"medicine":"Topical steroid cream","dose":"apply twice daily"}],"createdAt":"2025-09-11"},
  {"id":"R005","patientId":"P008","doctorId":"D005","diagnosis":"PCOS - follow up","prescription":[{"medicine":"Hormonal therapy","dose":"as advised"}],"createdAt":"2025-09-09"},
  {"id":"R006","patientId":"P005","doctorId":"D004","diagnosis":"Fracture recovery check","prescription":[{"medicine":"Calcium supplement","dose":"500mg daily"}],"createdAt":"2025-09-05"}
];

export const hospitalInfo = {
  "hospitalName":"AndhraCare General Hospital",
  "location":"Visakhapatnam, Andhra Pradesh",
  "departments":[
    {"id":"DEP01","name":"Cardiology"},
    {"id":"DEP02","name":"Neurology"},
    {"id":"DEP03","name":"Pediatrics"},
    {"id":"DEP04","name":"Orthopedics"},
    {"id":"DEP05","name":"Gynecology"},
    {"id":"DEP06","name":"Dermatology"}
  ],
  "rooms":[
    {"roomNo":"101","type":"General Ward","availability":"Available"},
    {"roomNo":"102","type":"Private Room","availability":"Occupied"},
    {"roomNo":"103","type":"ICU","availability":"Available"},
    {"roomNo":"201","type":"General Ward","availability":"Available"},
    {"roomNo":"202","type":"Private Room","availability":"Available"},
    {"roomNo":"301","type":"ICU","availability":"Occupied"}
  ],
  "services":["Emergency Care","24x7 Pharmacy","Diagnostic Lab","Surgery","Blood Bank"]
};

// Analytics helper functions
export const getAppointmentsPerMonth = (year: number = 2025) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map((month, index) => ({
    month,
    appointments: Math.floor(Math.random() * 50) + 20 // Random data for demo
  }));
};

export const getDoctorUtilization = (doctorId?: string) => {
  const doctor = doctors.find(d => d.id === doctorId) || doctors[0];
  const totalSlots = doctor.availability.reduce((acc: number, day: any) => acc + day.slots.length, 0);
  const confirmedAppointments = appointments.filter(a => a.doctorId === doctor.id && a.status === 'CONFIRMED').length;
  return Math.round((confirmedAppointments / totalSlots) * 100);
};

export const getBedOccupancyRate = () => {
  const totalRooms = hospitalInfo.rooms.length;
  const occupiedRooms = hospitalInfo.rooms.filter(r => r.availability === 'Occupied').length;
  return Math.round((occupiedRooms / totalRooms) * 100);
};

export const getRevenueData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map(month => ({
    month,
    revenue: Math.floor(Math.random() * 100000) + 50000 // Random revenue data
  }));
};
