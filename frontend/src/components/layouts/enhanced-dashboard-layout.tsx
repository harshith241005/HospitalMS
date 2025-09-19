'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { EnhancedSidebar } from '@/components/ui/enhanced-sidebar';
import { BottomLeftPanel } from '@/components/ui/bottom-left-panel';
import { QuickBookModal } from '@/components/modals/quick-book-modal';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Bell, 
  Menu, 
  Settings, 
  LogOut, 
  User, 
  MessageCircle,
  Search,
  Plus,
  Activity
} from 'lucide-react';
import { getCurrentUser, signOutUser } from '@/lib/auth';
import { wsManager } from '@/lib/api';
import { useOptimistic } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface EnhancedDashboardLayoutProps {
  children: React.ReactNode;
  userRole: 'patient' | 'doctor' | 'admin';
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}

export function EnhancedDashboardLayout({ children, userRole }: EnhancedDashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isQuickBookOpen, setIsQuickBookOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Welcome to HMS',
      message: 'Your account has been set up successfully.',
      type: 'success',
      timestamp: new Date(),
      read: false
    },
    {
      id: '2',
      title: 'System Update',
      message: 'New features have been added to your dashboard.',
      type: 'info',
      timestamp: new Date(Date.now() - 3600000),
      read: false
    }
  ]);

  const [appointments, setAppointments] = useState<any[]>([]);

  const addNotification = (notification: Notification) => {
    setNotifications(prev => [...prev, notification]);
  };

  const updateNotification = (id: string, updates: Partial<Notification>) => {
    setNotifications(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const addAppointment = (appointment: any) => {
    setAppointments(prev => [...prev, appointment]);
  };

  const updateAppointment = (id: string, updates: any) => {
    setAppointments(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Initialize WebSocket connection for real-time updates
  useEffect(() => {
    if (currentUser) {
      wsManager.connect();
      
      // Listen for real-time notifications
      wsManager.on('notification', (notification: Notification) => {
        addNotification(notification);
        toast({
          title: notification.title,
          description: notification.message,
        });
      });

      // Listen for appointment updates
      wsManager.on('appointment_update', (appointment: any) => {
        updateAppointment(appointment.id, appointment);
        toast({
          title: 'Appointment Updated',
          description: `Your appointment status has been changed to ${appointment.status}`,
        });
      });

      return () => {
        wsManager.disconnect();
      };
    }
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await signOutUser();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Logout Error',
        description: 'Failed to logout. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleQuickBook = () => {
    setIsQuickBookOpen(true);
  };

  const handleQuickAccept = () => {
    // For doctors - accept next pending appointment
    toast({
      title: 'Quick Accept',
      description: 'Next pending appointment has been accepted.',
    });
  };

  const handleQuickAdd = () => {
    // For admins - quick add functionality
    toast({
      title: 'Quick Add',
      description: 'Opening quick add dialog...',
    });
  };

  const handleOpenChat = () => {
    setIsChatOpen(true);
    toast({
      title: 'AI Assistant',
      description: 'Chat feature coming soon!',
    });
  };

  const handleOpenNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  const handleBookingSuccess = (appointment: any) => {
    if (appointment.shouldRemove) {
      // Remove failed optimistic appointment
      updateAppointment(appointment.id, { shouldRemove: true });
    } else {
      // Add or update appointment
      addAppointment(appointment);
    }
  };

  const markNotificationAsRead = (id: string) => {
    updateNotification(id, { read: true });
  };

  const getPageTitle = () => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1];
    
    if (lastSegment === userRole || lastSegment === 'dashboard') {
      return `${userRole.charAt(0).toUpperCase() + userRole.slice(1)} Dashboard`;
    }
    
    return lastSegment
      ? lastSegment.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ')
      : 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left side - Menu and Title */}
          <div className="flex items-center gap-4">
            {/* Mobile menu trigger */}
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <EnhancedSidebar userRole={userRole} />
              </SheetContent>
            </Sheet>

            {/* Logo and Hospital Name */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-gray-900">AndhraCare HMS</h1>
                <p className="text-xs text-gray-500">Hospital Management System</p>
              </div>
            </div>
          </div>

          {/* Center - Page Title */}
          <div className="hidden md:block">
            <h2 className="text-xl font-semibold text-gray-800">{getPageTitle()}</h2>
          </div>

          {/* Right side - Search, Notifications, Profile */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <Search className="h-4 w-4" />
            </Button>

            {/* Notifications */}
            <DropdownMenu open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-4 w-4" />
                  {unreadNotifications > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                      {unreadNotifications > 9 ? '9+' : unreadNotifications}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No notifications
                  </div>
                ) : (
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.slice(0, 5).map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className="flex flex-col items-start p-3 cursor-pointer"
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <div className="flex justify-between w-full">
                          <span className="font-medium text-sm">{notification.title}</span>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 mt-1">
                          {notification.message}
                        </span>
                        <span className="text-xs text-gray-400 mt-1">
                          {notification.timestamp.toLocaleTimeString()}
                        </span>
                      </DropdownMenuItem>
                    ))}
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentUser?.email ? `https://picsum.photos/seed/${currentUser.email}/200/200` : ''} />
                    <AvatarFallback>
                      {currentUser?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {currentUser?.name || 'User'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {currentUser?.email}
                    </p>
                    <Badge variant="secondary" className="w-fit mt-1">
                      {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <EnhancedSidebar userRole={userRole} />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>

      {/* Bottom Left Panel */}
      <BottomLeftPanel
        userRole={userRole}
        onQuickBook={handleQuickBook}
        onQuickAccept={handleQuickAccept}
        onQuickAdd={handleQuickAdd}
        onOpenChat={handleOpenChat}
        onOpenNotifications={handleOpenNotifications}
        notificationCount={unreadNotifications}
      />

      {/* Quick Book Modal */}
      <QuickBookModal
        isOpen={isQuickBookOpen}
        onClose={() => setIsQuickBookOpen(false)}
        onBookingSuccess={handleBookingSuccess}
      />

      {/* Chat Modal (placeholder) */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96 max-w-[90vw]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                AI Assistant
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setIsChatOpen(false)}>
                ×
              </Button>
            </div>
            <div className="text-center py-8 text-gray-500">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>AI Chat Assistant</p>
              <p className="text-sm">Coming soon in the next update!</p>
            </div>
            <Button 
              onClick={() => setIsChatOpen(false)} 
              className="w-full mt-4"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
