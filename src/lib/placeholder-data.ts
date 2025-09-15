import type { User, Patient, Doctor, Staff, Admin, Appointment, Prescription, Report } from './types';

export const users: User[] = [
  { id: 'admin-1', name: 'Dr. Evelyn Reed', email: 'evelyn.reed@meditrack.pro', role: 'admin', avatarUrl: 'https://picsum.photos/seed/avatar7/200/200', dataAiHint: 'professional person' },
  { id: 'doc-1', name: 'Dr. Alan Grant', email: 'alan.grant@meditrack.pro', role: 'doctor', specialization: 'Cardiology', avatarUrl: 'https://picsum.photos/seed/avatar2/200/200', dataAiHint: 'doctor man' },
  { id: 'doc-2', name: 'Dr. Ellie Sattler', email: 'ellie.sattler@meditrack.pro', role: 'doctor', specialization: 'Pediatrics', avatarUrl: 'https://picsum.photos/seed/avatar1/200/200', dataAiHint: 'doctor woman' },
  { id: 'staff-1', name: 'John Hammond', email: 'john.hammond@meditrack.pro', role: 'staff', avatarUrl: 'https://picsum.photos/seed/avatar6/200/200', dataAiHint: 'nurse man' },
  { id: 'staff-2', name: 'Sarah Harding', email: 'sarah.harding@meditrack.pro', role: 'staff', avatarUrl: 'https://picsum.photos/seed/avatar5/200/200', dataAiHint: 'nurse woman' },
  { id: 'pat-1', name: 'Ian Malcolm', email: 'ian.malcolm@meditrack.pro', role: 'patient', avatarUrl: 'https://picsum.photos/seed/avatar4/200/200', dataAiHint: 'patient man' },
  { id: 'pat-2', name: 'Lex Murphy', email: 'lex.murphy@meditrack.pro', role: 'patient', avatarUrl: 'https://picsum.photos/seed/avatar3/200/200', dataAiHint: 'patient woman' },
];

export const doctors: Doctor[] = users.filter(u => u.role === 'doctor') as Doctor[];
export const patients: Patient[] = users.filter(u => u.role === 'patient') as Patient[];
export const staff: Staff[] = users.filter(u => u.role === 'staff') as Staff[];
export const admins: Admin[] = users.filter(u => u.role === 'admin') as Admin[];

export const appointments: Appointment[] = [
  { id: 'appt-1', patient: patients[0], doctor: doctors[0], date: new Date(new Date().setDate(new Date().getDate() + 2)), status: 'Scheduled', reason: 'Annual Checkup' },
  { id: 'appt-2', patient: patients[1], doctor: doctors[1], date: new Date(new Date().setDate(new Date().getDate() + 3)), status: 'Scheduled', reason: 'Follow-up consultation' },
  { id: 'appt-3', patient: patients[0], doctor: doctors[1], date: new Date(new Date().setDate(new Date().getDate() - 10)), status: 'Completed', reason: 'Flu symptoms' },
  { id: 'appt-4', patient: patients[1], doctor: doctors[0], date: new Date(new Date().setDate(new Date().getDate() - 20)), status: 'Canceled', reason: 'Personal reasons' },
  { id: 'appt-5', patient: patients[0], doctor: doctors[0], date: new Date(new Date().setDate(new Date().getDate() + 5)), status: 'Pending Approval', reason: 'Chest pain' },
  { id: 'appt-6', patient: {id: 'pat-3', name: 'Tim Murphy', email: 'tim.murphy@meditrack.pro', role: 'patient', avatarUrl: 'https://picsum.photos/seed/avatar8/200/200'}, doctor: doctors[1], date: new Date(new Date().setDate(new Date().getDate() + 1)), status: 'Pending Approval', reason: 'Initial consultation' },
];

export const prescriptions: Prescription[] = [
  { 
    id: 'pres-1', 
    appointmentId: 'appt-3', 
    doctor: doctors[1], 
    patient: patients[0],
    date: new Date(new Date().setDate(new Date().getDate() - 10)), 
    medications: [
      { name: 'Amoxicillin', dosage: '500mg', frequency: 'Twice a day' },
      { name: 'Ibuprofen', dosage: '200mg', frequency: 'As needed for pain' }
    ],
    notes: 'Take with food. Complete the full course of antibiotics.',
    fullText: 'Patient: Ian Malcolm. DOB: 10/26/1952. Prescriber: Dr. Ellie Sattler, MD.\nDate: [Date 10 days ago].\nMedication: Amoxicillin 500mg. Sig: Take 1 tablet by mouth two times per day for 10 days. Dispense: #20.\nMedication: Ibuprofen 200mg. Sig: Take 1-2 tablets by mouth every 4-6 hours as needed for fever or pain. Dispense: #30.\nNotes: Finish all antibiotics. Call if symptoms worsen. Avoid alcohol.'
  },
   { 
    id: 'pres-2', 
    appointmentId: 'appt-1', 
    doctor: doctors[0], 
    patient: patients[0],
    date: new Date(new Date().setDate(new Date().getDate() - 30)), 
    medications: [
      { name: 'Lisinopril', dosage: '10mg', frequency: 'Once a day' },
    ],
    notes: 'Monitor blood pressure regularly.',
    fullText: 'Patient: Ian Malcolm. DOB: 10/26/1952. Prescriber: Dr. Alan Grant, MD.\nDate: [Date 30 days ago].\nMedication: Lisinopril 10mg. Sig: Take 1 tablet by mouth once daily. Dispense: #90 (90-day supply).\nRefills: 3.\nNotes: For hypertension. Monitor blood pressure weekly. Follow up in 3 months.'
  }
];

export const reports: Report[] = [
    { id: 'rep-1', patientId: 'pat-1', name: 'Blood Test Results - Jan 2024.pdf', uploadDate: new Date('2024-01-20'), url: '#' },
    { id: 'rep-2', patientId: 'pat-1', name: 'X-Ray - Chest - Feb 2024.pdf', uploadDate: new Date('2024-02-15'), url: '#' },
    { id: 'rep-3', patientId: 'pat-2', name: 'Annual Physical Summary - Dec 2023.pdf', uploadDate: new Date('2023-12-10'), url: '#' },
];
