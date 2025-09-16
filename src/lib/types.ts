export type UserRole = 'admin' | 'doctor' | 'staff' | 'patient';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  dataAiHint?: string;
  specialization?: string; // Optional for doctors
}

export interface Patient extends User {
  role: 'patient';
  medicalHistory?: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
}

export interface Doctor extends User {
  role: 'doctor';
  specialization: string;
  schedule?: any[];
}

export interface Staff extends User {
  role: 'staff';
}

export interface Admin extends User {
  role: 'admin';
}

export type AppointmentStatus = 'Scheduled' | 'Completed' | 'Canceled' | 'Pending Approval';

export interface Appointment {
  id: string;
  patient: Patient;
  doctor: Doctor;
  date: Date;
  status: AppointmentStatus;
  reason: string;
}

export interface Prescription {
  id: string;
  appointmentId: string;
  doctor: Doctor;
  patient: Patient;
  date: Date;
  medications: Medication[];
  notes: string;
  fullText: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
}

export interface Report {
  id: string;
  patientId: string;
  name: string;
  uploadDate: Date;
  url: string;
}

export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    date: Date;
    read: boolean;
}
