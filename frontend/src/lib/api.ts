'use client';

import { getCurrentUser } from './auth';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// API Response Types
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// Custom API Error Class
class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

// Request Configuration
interface RequestConfig extends RequestInit {
  skipAuth?: boolean;
  useFormData?: boolean;
}

// API Client Class
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    const firebaseUid = localStorage.getItem('firebaseUid');
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (firebaseUid) {
      headers['X-Firebase-UID'] = firebaseUid;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    
    let data: any;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMessage = data?.message || data?.error || `HTTP ${response.status}: ${response.statusText}`;
      throw new ApiError(errorMessage, response.status, data?.code);
    }

    return data;
  }

  async request<T = any>(
    endpoint: string, 
    config: RequestConfig = {}
  ): Promise<T> {
    const { skipAuth = false, useFormData = false, ...requestConfig } = config;
    
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: HeadersInit = skipAuth ? {} : this.getAuthHeaders();
    
    if (useFormData && headers['Content-Type']) {
      delete (headers as any)['Content-Type']; // Let browser set multipart boundary
    }

    const finalConfig: RequestInit = {
      ...requestConfig,
      headers: {
        ...headers,
        ...requestConfig.headers,
      },
    };

    try {
      const response = await fetch(url, finalConfig);
      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Network or other errors
      throw new ApiError(
        error instanceof Error ? error.message : 'Network error occurred',
        0
      );
    }
  }

  // Convenience methods
  async get<T = any>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T = any>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: config?.useFormData ? data : JSON.stringify(data),
    });
  }

  async put<T = any>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: config?.useFormData ? data : JSON.stringify(data),
    });
  }

  async patch<T = any>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: config?.useFormData ? data : JSON.stringify(data),
    });
  }

  async delete<T = any>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }
}

// Create API client instance
export const api = new ApiClient(API_BASE_URL);

// Custom React Hook for API calls
import { useState, useEffect } from 'react';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
}

export function useApi<T = any>(
  endpoint: string | null, 
  config?: RequestConfig
): UseApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchData = async () => {
    if (!endpoint) return;

    setLoading(true);
    setError(null);

    try {
      const result = await api.get<T>(endpoint, config);
      setData(result);
    } catch (err) {
      setError(err instanceof ApiError ? err : new ApiError('Unknown error', 0));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

// Optimistic Update Hook
interface UseOptimisticState<T> {
  items: T[];
  addOptimistic: (item: T) => void;
  removeOptimistic: (id: string) => void;
  updateOptimistic: (id: string, updates: Partial<T>) => void;
  setItems: (items: T[]) => void;
}

export function useOptimistic<T extends { id: string; isOptimistic?: boolean }>(
  initialItems: T[] = []
): UseOptimisticState<T> {
  const [items, setItems] = useState<T[]>(initialItems);

  const addOptimistic = (item: T) => {
    setItems(prev => [...prev, { ...item, isOptimistic: true }]);
  };

  const removeOptimistic = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const updateOptimistic = (id: string, updates: Partial<T>) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  return {
    items,
    addOptimistic,
    removeOptimistic,
    updateOptimistic,
    setItems,
  };
}

// Specific API endpoints
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials, { skipAuth: true }),
  
  register: (userData: any) =>
    api.post('/auth/register', userData, { skipAuth: true }),
  
  checkUser: (email: string) =>
    api.post('/auth/check-user', { email }, { skipAuth: true }),
  
  registerFirebase: (userData: any) =>
    api.post('/auth/register-firebase', userData, { skipAuth: true }),
  
  getProfile: () =>
    api.get('/auth/profile'),
};

export const dashboardApi = {
  getPatientDashboard: () =>
    api.get('/dashboard/patient'),
  
  getDoctorDashboard: () =>
    api.get('/dashboard/doctor'),
  
  getAdminDashboard: () =>
    api.get('/dashboard/admin'),
  
  getHospitalOverview: () =>
    api.get('/dashboard/hospital-overview'),
};

export const appointmentApi = {
  getAppointments: (filters?: any) =>
    api.get('/appointments', { body: JSON.stringify(filters) }),
  
  bookAppointment: (appointmentData: any) =>
    api.post('/appointments', appointmentData),
  
  updateAppointmentStatus: (id: string, status: string) =>
    api.patch(`/appointments/${id}/status`, { status }),
  
  cancelAppointment: (id: string, reason?: string) =>
    api.patch(`/appointments/${id}/cancel`, { reason }),
  
  rescheduleAppointment: (id: string, newDate: string, newTime: string) =>
    api.patch(`/appointments/${id}/reschedule`, { date: newDate, time: newTime }),
};

export const patientApi = {
  getPatients: (page = 1, limit = 10) =>
    api.get(`/patients?page=${page}&limit=${limit}`),
  
  getPatient: (id: string) =>
    api.get(`/patients/${id}`),
  
  createPatient: (patientData: any) =>
    api.post('/patients', patientData),
  
  updatePatient: (id: string, updates: any) =>
    api.put(`/patients/${id}`, updates),
  
  getPatientAppointments: (id: string) =>
    api.get(`/patients/${id}/appointments`),
  
  getPatientReports: (id: string) =>
    api.get(`/patients/${id}/reports`),
};

export const doctorApi = {
  getDoctors: (page = 1, limit = 10) =>
    api.get(`/doctors?page=${page}&limit=${limit}`),
  
  getDoctor: (id: string) =>
    api.get(`/doctors/${id}`),
  
  createDoctor: (doctorData: any) =>
    api.post('/doctors', doctorData),
  
  updateDoctor: (id: string, updates: any) =>
    api.put(`/doctors/${id}`, updates),
  
  getDoctorSchedule: (id: string) =>
    api.get(`/doctors/${id}/schedule`),
  
  updateDoctorSchedule: (id: string, schedule: any) =>
    api.put(`/doctors/${id}/schedule`, schedule),
  
  getDoctorAppointments: (id: string, date?: string) =>
    api.get(`/doctors/${id}/appointments${date ? `?date=${date}` : ''}`),
};

export const reportsApi = {
  getReports: (patientId?: string) =>
    api.get(`/reports${patientId ? `?patientId=${patientId}` : ''}`),
  
  createReport: (reportData: any) =>
    api.post('/reports', reportData),
  
  updateReport: (id: string, updates: any) =>
    api.put(`/reports/${id}`, updates),
  
  deleteReport: (id: string) =>
    api.delete(`/reports/${id}`),
  
  downloadReport: (id: string) =>
    api.get(`/reports/${id}/download`),
};

export const analyticsApi = {
  getAppointmentsPerMonth: (year = 2025) =>
    api.get(`/analytics/appointments-per-month?year=${year}`),
  
  getDoctorUtilization: (doctorId?: string, period = 'last30days') =>
    api.get(`/analytics/doctor-utilization?doctorId=${doctorId}&period=${period}`),
  
  getRevenueMonthly: () =>
    api.get('/analytics/revenue-monthly'),
  
  getBedOccupancy: () =>
    api.get('/analytics/bed-occupancy'),
  
  getDepartmentStats: () =>
    api.get('/analytics/department-stats'),
};

// File upload utility
export const uploadFile = async (file: File, endpoint: string): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);
  
  return api.post(endpoint, formData, { useFormData: true });
};

// WebSocket connection for real-time updates
export class WebSocketManager {
  private ws: WebSocket | null = null;
  private listeners: Map<string, Function[]> = new Map();
  
  connect(url: string = 'ws://localhost:5000') {
    const user = getCurrentUser();
    if (!user) return;
    
    this.ws = new WebSocket(`${url}?userId=${user.id}&role=${user.role}`);
    
    this.ws.onopen = () => {
      console.log('WebSocket connected');
    };
    
    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.emit(data.type, data.payload);
      } catch (error) {
        console.error('WebSocket message parse error:', error);
      }
    };
    
    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      // Attempt to reconnect after 3 seconds
      setTimeout(() => this.connect(url), 3000);
    };
  }
  
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }
  
  off(event: string, callback: Function) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }
  
  emit(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }
  
  send(type: string, payload: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
    }
  }
  
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const wsManager = new WebSocketManager();

// Error boundary for API errors
export { ApiError };
