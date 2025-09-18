import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hospital Management System',
  description: 'A role-based hospital management system.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
