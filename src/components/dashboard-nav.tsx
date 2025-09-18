'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarContent,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Stethoscope,
  Users,
  LogOut,
  User,
  Settings,
  Moon,
  Sun,
  Bell,
  ClipboardCheck,
  Video,
  LineChart,
  Wallet,
  TestTube,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

type UserRole = 'admin' | 'doctor' | 'patient';

const adminNav = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/doctors', label: 'Manage Doctors', icon: Stethoscope },
  { href: '/admin/patients', label: 'Manage Patients', icon: Users },
  { href: '/admin/appointments', label: 'View Appointments', icon: Calendar },
  { href: '/admin/reports', label: 'Reports & Analytics', icon: LineChart },
];

const doctorNav = [
  { href: '/doctor', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/doctor/appointments', label: 'My Appointments', icon: Users },
  { href: '/doctor/schedule', label: 'Schedule Management', icon: Calendar },
  { href: '/doctor/prescriptions', label: 'Prescriptions', icon: FileText },
  { href: '/doctor/history', label: 'Patient History', icon: User },
];

const patientNav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/appointments', label: 'My Appointments', icon: Calendar },
  { href: '/dashboard/reports', label: 'Reports', icon: FileText },
  { href: '/dashboard/billing', label: 'Billing & Payments', icon: Wallet },
];

const navItems: Record<UserRole, { href: string; label: string; icon: React.ElementType }[]> = {
  admin: adminNav,
  doctor: doctorNav,
  patient: patientNav,
};

function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <SidebarMenuButton tooltip="Toggle Theme" asChild>
      <div>
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="group-data-[collapsible=icon]:hidden" onClick={() => setTheme(useTheme().theme === 'dark' ? 'light' : 'dark')}>Toggle theme</span>
        <span className="sr-only">Toggle theme</span>
      </div>
    </SidebarMenuButton>
  );
}

export function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [userRole, setUserRole] = useState<UserRole>('patient');
  const [currentUser, setCurrentUser] = useState<{name: string, email: string, avatarUrl?: string, dataAiHint?: string} | null>(null);
  
  useEffect(() => {
    const role = pathname.split('/')[1];
    if (role === 'admin' || role === 'doctor') {
      setUserRole(role);
    } else {
      setUserRole('patient');
    }
  }, [pathname]);

   useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const email = user.email || '';
        let role: UserRole = 'patient';
        if (email.startsWith('admin')) {
            role = 'admin';
        } else if (email.startsWith('doctor')) {
            role = 'doctor';
        }
        
        setCurrentUser({
            name: user.displayName || 'User',
            email: email,
        });

        // Redirect if user is on the wrong dashboard
        const currentPathRole = pathname.split('/')[1];
        const expectedPathRole = role === 'patient' ? 'dashboard' : role;
        if (currentPathRole !== expectedPathRole && currentPathRole !== 'register' && currentPathRole !== '') {
           router.push(`/${expectedPathRole}`);
        }

      } else {
        router.push('/');
      }
    });
    return () => unsubscribe();
  }, [pathname, router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const currentNav = navItems[userRole];
  const settingsPath = `/${userRole === 'patient' ? 'dashboard' : userRole}/settings`;

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-3 p-2">
            <Stethoscope className="w-8 h-8 text-primary" />
            <span className="font-bold text-xl font-headline group-data-[collapsible=icon]:hidden">MediTrack Pro</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {currentNav.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  asChild
                  tooltip={item.label}
                >
                  <div>
                    <item.icon />
                    <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                  </div>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarMenu>
            <SidebarMenuItem>
                <ThemeToggle />
            </SidebarMenuItem>
            <SidebarMenuItem>
                <Link href={settingsPath} passHref>
                    <SidebarMenuButton tooltip="Settings" asChild isActive={pathname === settingsPath}>
                        <div>
                            <Settings/>
                            <span className="group-data-[collapsible=icon]:hidden">Settings</span>
                        </div>
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} asChild tooltip="Logout">
                    <div>
                        <LogOut/>
                        <span className="group-data-[collapsible=icon]:hidden">Logout</span>
                    </div>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
        <div className="p-2 mt-2 border-t group-data-[collapsible=icon]:hidden">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={currentUser?.avatarUrl} alt={currentUser?.name} data-ai-hint={currentUser?.dataAiHint} />
              <AvatarFallback>{currentUser?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-sm truncate">
                <span className="font-semibold truncate">{currentUser?.name}</span>
                <span className="text-muted-foreground truncate">{currentUser?.email}</span>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </>
  );
}
