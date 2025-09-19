import { redirect } from 'next/navigation';

// This page is not part of the final prompt, redirecting to the main admin dashboard.
export default function AttendancePage() {
    redirect('/admin');
}
