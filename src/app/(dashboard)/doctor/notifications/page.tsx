import { redirect } from 'next/navigation';

// This page is not part of the final prompt, redirecting to the main doctor dashboard.
export default function NotificationsPage() {
    redirect('/doctor');
}
