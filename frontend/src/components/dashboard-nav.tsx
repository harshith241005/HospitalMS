
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
  LineChart,
  Wallet,
  PenSquare,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { onAuthStateChange, signOutUser, getCurrentUser, AuthUser } from '@/lib/auth';
import { users } from '@/lib/placeholder-data';
import type { User as AppUser } from '@/lib/types';

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
  { href: '/doctor/appointments', label: 'Appointment Requests', icon: Users },
  { href: '/doctor/schedule', label: 'My Schedule', icon: Calendar },
  { href: '/doctor/prescriptions', label: 'Create Prescription', icon: PenSquare },
  { href: '/doctor/history', label: 'Patient History', icon: FileText },
];

const patientNav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/appointments', label: 'My Appointments', icon: Calendar },
  { href: '/dashboard/reports', label: 'My Records', icon: FileText },
  { href: '/dashboard/billing', label: 'Billing', icon: Wallet },
];

const navItems: Record<UserRole, { href: string; label: string; icon: React.ElementType }[]> = {
  admin: adminNav,
  doctor: doctorNav,
  patient: patientNav,
};

function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <SidebarMenuButton tooltip="Toggle Theme" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="group-data-[collapsible=icon]:hidden">Toggle theme</span>
        <span className="sr-only">Toggle theme</span>
    </SidebarMenuButton>
  );
}

export function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [userRole, setUserRole] = useState<UserRole>('patient');
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  
  useEffect(() => {
    // Check for demo accounts first
    const urlParams = new URLSearchParams(window.location.search);
    const mockUserEmail = urlParams.get('logged_in_as');
    
    if (mockUserEmail) {
      // Handle demo login
      const email = mockUserEmail;
      let matchedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (email === 'harshithboyina@gmail.com' || email.startsWith('admin@')) matchedUser = users.find(u => u.role === 'admin');
      else if (email.startsWith('doctor@')) matchedUser = users.find(u => u.role === 'doctor');
      else if (email.startsWith('patient@')) matchedUser = users.find(u => u.role === 'patient');

      if (matchedUser) {
        setCurrentUser(matchedUser);
        setUserRole(matchedUser.role);
        const expectedPathRole = matchedUser.role === 'patient' ? 'dashboard' : matchedUser.role;
        const currentPathRole = pathname.split('/')[1];

        if (currentPathRole !== expectedPathRole && !['login', 'register', ''].includes(currentPathRole)) {
           router.push(`/${expectedPathRole}`);
        }
      }
      return;
    }

    // Use Firebase auth state listener
    const unsubscribe = onAuthStateChange((authUser: AuthUser | null) => {
      if (authUser) {
        const appUser: AppUser = {
          id: authUser.id,
          name: authUser.name,
          email: authUser.email,
          role: authUser.role,
          avatarUrl: `https://picsum.photos/seed/${encodeURIComponent(authUser.email)}/200/200`,
          dataAiHint: 'person'
        };
        
        setCurrentUser(appUser);
        setUserRole(authUser.role);

        const expectedPathRole = authUser.role === 'patient' ? 'dashboard' : authUser.role;
        const currentPathRole = pathname.split('/')[1];

        if (currentPathRole !== expectedPathRole && !['login', 'register', ''].includes(currentPathRole)) {
          router.push(`/${expectedPathRole}`);
        }
      } else {
        // No authenticated user, redirect to home
        const currentPathRole = pathname.split('/')[1];
        if (!['login', 'register', ''].includes(currentPathRole)) {
          router.push('/');
        }
      }
    });

    return () => unsubscribe();
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      // Check if it's a demo login
      if (window.location.search.includes('logged_in_as')) {
        router.push('/');
        return;
      }
      
      // Use Firebase sign out
      await signOutUser();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Clear local storage as fallback
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('firebaseUid');
      router.push('/');
    }
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
