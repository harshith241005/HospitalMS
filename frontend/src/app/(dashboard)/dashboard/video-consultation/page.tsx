import { redirect } from 'next/navigation';

// This page is not part of the final prompt, redirecting to the main patient dashboard.
export default function VideoConsultationPage() {
    redirect('/dashboard');
}
