'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Calendar, 
  FileText, 
  Receipt, 
  User, 
  Stethoscope, 
  FolderOpen, 
  Clipboard, 
  Schedule,
  Dashboard,
  Users,
  Building,
  BarChart3,
  Settings,
  MessageCircle,
  Activity,
  Heart,
  Phone,
  Video,
  Bell,
  Pill,
  TestTube,
  Bed,
  Package,
  CreditCard,
  TrendingUp,
  UserPlus,
  FileBarChart
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  description?: string;
}

interface EnhancedSidebarProps {
  userRole: 'patient' | 'doctor' | 'admin';
  className?: string;
}

const patientSidebarItems: SidebarItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: <Dashboard className="h-4 w-4" />,
    description: 'Overview: upcoming appointment card, quick actions'
  },
  {
    href: '/dashboard/book-appointment',
    label: 'Book Appointment',
    icon: <Calendar className="h-4 w-4" />,
    description: 'Form: doctor, department, date, time, symptoms'
  },
  {
    href: '/dashboard/appointments',
    label: 'My Appointments',
    icon: <Schedule className="h-4 w-4" />,
    description: 'List + cancel/reschedule'
  },
  {
    href: '/dashboard/prescriptions',
    label: 'Prescriptions',
    icon: <Pill className="h-4 w-4" />,
    description: 'List + download PDF'
  },
  {
    href: '/dashboard/reports',
    label: 'Lab Reports',
    icon: <FileText className="h-4 w-4" />,
    description: 'View / download images/PDF'
  },
  {
    href: '/dashboard/billing',
    label: 'Billing & Payments',
    icon: <Receipt className="h-4 w-4" />,
    description: 'Invoices, pay now — integrate Razorpay/Stripe later'
  },
  {
    href: '/dashboard/vitals',
    label: 'Vitals & History',
    icon: <Heart className="h-4 w-4" />,
    description: 'Enter/see recent vitals: BP, sugar, weight'
  },
  {
    href: '/dashboard/messages',
    label: 'Messages / Support',
    icon: <MessageCircle className="h-4 w-4" />,
    description: 'Chat with staff'
  },
  {
    href: '/dashboard/profile',
    label: 'Profile & Medical History',
    icon: <User className="h-4 w-4" />,
    description: 'Edit contact, allergies, chronic conditions'
  }
];

const doctorSidebarItems: SidebarItem[] = [
  {
    href: '/doctor',
    label: 'Dashboard',
    icon: <Dashboard className="h-4 w-4" />,
    description: 'Today\'s schedule, pending approvals'
  },
  {
    href: '/doctor/appointments',
    label: 'My Appointments',
    icon: <Schedule className="h-4 w-4" />,
    description: 'Calendar + list; accept / reject / reschedule'
  },
  {
    href: '/doctor/schedule',
    label: 'Schedule Management',
    icon: <Calendar className="h-4 w-4" />,
    description: 'Set recurring availability slots'
  },
  {
    href: '/doctor/patients',
    label: 'Patient Records',
    icon: <FolderOpen className="h-4 w-4" />,
    description: 'Search patients, view full history'
  },
  {
    href: '/doctor/create-report',
    label: 'Create Report / Prescription',
    icon: <Clipboard className="h-4 w-4" />,
    description: 'Form + save + generate PDF'
  },
  {
    href: '/doctor/lab-requests',
    label: 'Lab Requests',
    icon: <TestTube className="h-4 w-4" />,
    description: 'Order tests & receive uploads'
  },
  {
    href: '/doctor/teleconsult',
    label: 'Teleconsult',
    icon: <Video className="h-4 w-4" />,
    description: 'Start/join video call'
  },
  {
    href: '/doctor/notifications',
    label: 'Notifications',
    icon: <Bell className="h-4 w-4" />,
    description: 'Urgent messages: cancellations'
  },
  {
    href: '/doctor/profile',
    label: 'Profile & Settings',
    icon: <User className="h-4 w-4" />,
    description: 'Personal settings and preferences'
  }
];

const adminSidebarItems: SidebarItem[] = [
  {
    href: '/admin',
    label: 'Overview',
    icon: <Dashboard className="h-4 w-4" />,
    description: 'KPIs: total doctors, patients, appointments today, bed occupancy'
  },
  {
    href: '/admin/doctors',
    label: 'Manage Doctors',
    icon: <Stethoscope className="h-4 w-4" />,
    description: 'CRUD, import CSV'
  },
  {
    href: '/admin/patients',
    label: 'Manage Patients',
    icon: <Users className="h-4 w-4" />,
    description: 'View / merge / deactivate'
  },
  {
    href: '/admin/appointments',
    label: 'Appointments',
    icon: <Calendar className="h-4 w-4" />,
    description: 'All + filters'
  },
  {
    href: '/admin/reports',
    label: 'Reports',
    icon: <FileBarChart className="h-4 w-4" />,
    description: 'View / export'
  },
  {
    href: '/admin/rooms',
    label: 'Rooms & Beds',
    icon: <Bed className="h-4 w-4" />,
    description: 'Assign / availability'
  },
  {
    href: '/admin/inventory',
    label: 'Pharmacy Inventory',
    icon: <Package className="h-4 w-4" />,
    description: 'Stock levels, reorder alerts'
  },
  {
    href: '/admin/billing',
    label: 'Billing & Revenue',
    icon: <CreditCard className="h-4 w-4" />,
    description: 'Invoices, refunds'
  },
  {
    href: '/admin/analytics',
    label: 'Analytics & Charts',
    icon: <BarChart3 className="h-4 w-4" />,
    description: 'Appointments per dept, revenue over time'
  },
  {
    href: '/admin/settings',
    label: 'Settings',
    icon: <Settings className="h-4 w-4" />,
    description: 'Hospital info, departments, users & roles'
  }
];

export function EnhancedSidebar({ userRole, className }: EnhancedSidebarProps) {
  const pathname = usePathname();

  const getSidebarItems = (): SidebarItem[] => {
    switch (userRole) {
      case 'patient':
        return patientSidebarItems;
      case 'doctor':
        return doctorSidebarItems;
      case 'admin':
        return adminSidebarItems;
      default:
        return [];
    }
  };

  const sidebarItems = getSidebarItems();

  return (
    <div className={cn("w-64 bg-white border-r border-gray-200 h-full", className)}>
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 capitalize">
          {userRole} Dashboard
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {userRole === 'patient' && 'Manage your health and appointments'}
          {userRole === 'doctor' && 'Patient care and schedule management'}
          {userRole === 'admin' && 'Hospital operations and analytics'}
        </p>
      </div>

      <nav className="mt-4 px-2">
        <ul className="space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200",
                    isActive
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  )}
                  title={item.description}
                >
                  <span className={cn(
                    "mr-3 flex-shrink-0",
                    isActive ? "text-blue-500" : "text-gray-400 group-hover:text-gray-500"
                  )}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Role-specific quick stats */}
      <div className="mt-8 px-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Quick Stats
          </h3>
          {userRole === 'patient' && (
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Next Appointment</span>
                <span className="font-medium">Tomorrow</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pending Reports</span>
                <span className="font-medium">2</span>
              </div>
            </div>
          )}
          {userRole === 'doctor' && (
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Today's Patients</span>
                <span className="font-medium">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pending Approvals</span>
                <span className="font-medium">3</span>
              </div>
            </div>
          )}
          {userRole === 'admin' && (
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Patients</span>
                <span className="font-medium">1,247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bed Occupancy</span>
                <span className="font-medium">78%</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
