import { redirect } from 'next/navigation';

// This page is now consolidated into the Reports page for patients.
export default function PrescriptionsPage() {
    redirect('/dashboard/reports');
}
