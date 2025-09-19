import { redirect } from 'next/navigation';

// This page has been consolidated into Manage Doctors.
export default function ManageStaffPage() {
    redirect('/admin/doctors');
}
