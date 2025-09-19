'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock, Stethoscope, User } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { doctors, hospitalInfo } from '@/lib/placeholder-data';
import { useToast } from '@/hooks/use-toast';

interface QuickBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess?: (appointment: any) => void;
}

interface BookingForm {
  doctorId: string;
  departmentId: string;
  date: Date | undefined;
  time: string;
  reason: string;
  symptoms: string;
  urgency: 'routine' | 'urgent' | 'emergency';
}

export function QuickBookModal({ isOpen, onClose, onBookingSuccess }: QuickBookModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<BookingForm>({
    doctorId: '',
    departmentId: '',
    date: undefined,
    time: '',
    reason: '',
    symptoms: '',
    urgency: 'routine'
  });

  const availableTimeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  const filteredDoctors = formData.departmentId 
    ? doctors.filter(doc => doc.departmentId === formData.departmentId)
    : doctors;

  const selectedDoctor = doctors.find(doc => doc.id === formData.doctorId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.doctorId || !formData.date || !formData.time || !formData.reason) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    // Create optimistic appointment object
    const optimisticAppointment = {
      id: `temp-${Date.now()}`,
      patientId: 'current-patient',
      doctorId: formData.doctorId,
      doctorName: selectedDoctor?.name || 'Unknown Doctor',
      date: format(formData.date, 'yyyy-MM-dd'),
      time: formData.time,
      status: 'PENDING',
      reason: formData.reason,
      symptoms: formData.symptoms.split(',').map(s => s.trim()).filter(Boolean),
      urgency: formData.urgency,
      createdAt: new Date().toISOString(),
      isOptimistic: true
    };

    // Immediately update UI (optimistic update)
    onBookingSuccess?.(optimisticAppointment);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success/failure randomly for demo
      const isSuccess = Math.random() > 0.2; // 80% success rate
      
      if (isSuccess) {
        // Replace optimistic appointment with real one
        const confirmedAppointment = {
          ...optimisticAppointment,
          id: `A${Date.now()}`,
          isOptimistic: false,
          confirmationNumber: `HMS-${Date.now().toString().slice(-6)}`
        };

        onBookingSuccess?.(confirmedAppointment);

        toast({
          title: "Appointment Booked Successfully!",
          description: `Your appointment with ${selectedDoctor?.name} is scheduled for ${format(formData.date, 'PPP')} at ${formData.time}. Confirmation: ${confirmedAppointment.confirmationNumber}`,
        });

        // Reset form and close modal
        setFormData({
          doctorId: '',
          departmentId: '',
          date: undefined,
          time: '',
          reason: '',
          symptoms: '',
          urgency: 'routine'
        });
        onClose();
      } else {
        throw new Error('Booking failed');
      }
    } catch (error) {
      // Remove optimistic appointment on failure
      onBookingSuccess?.({ ...optimisticAppointment, shouldRemove: true });
      
      toast({
        title: "Booking Failed",
        description: "Unable to book appointment. Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof BookingForm, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-blue-600" />
            Quick Book Appointment
          </DialogTitle>
          <DialogDescription>
            Book an appointment with your preferred doctor. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Department Selection */}
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select 
              value={formData.departmentId} 
              onValueChange={(value) => {
                handleInputChange('departmentId', value);
                handleInputChange('doctorId', ''); // Reset doctor when department changes
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {hospitalInfo.departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Doctor Selection */}
          <div className="space-y-2">
            <Label htmlFor="doctor">Doctor *</Label>
            <Select 
              value={formData.doctorId} 
              onValueChange={(value) => handleInputChange('doctorId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select doctor" />
              </SelectTrigger>
              <SelectContent>
                {filteredDoctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{doctor.name}</div>
                        <div className="text-sm text-gray-500">{doctor.specialization}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedDoctor && (
              <div className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                <strong>{selectedDoctor.name}</strong> - {selectedDoctor.specialization}
                <br />
                Experience: {selectedDoctor.experience} years
                <br />
                Phone: {selectedDoctor.phone}
              </div>
            )}
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <Label>Appointment Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? format(formData.date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => handleInputChange('date', date)}
                  disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <Label htmlFor="time">Preferred Time *</Label>
            <Select 
              value={formData.time} 
              onValueChange={(value) => handleInputChange('time', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select time slot" />
              </SelectTrigger>
              <SelectContent>
                {availableTimeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {time}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Urgency Level */}
          <div className="space-y-2">
            <Label htmlFor="urgency">Urgency Level</Label>
            <Select 
              value={formData.urgency} 
              onValueChange={(value: 'routine' | 'urgent' | 'emergency') => handleInputChange('urgency', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="routine">Routine Checkup</SelectItem>
                <SelectItem value="urgent">Urgent Care</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reason for Visit */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Visit *</Label>
            <Input
              id="reason"
              placeholder="e.g., Annual checkup, Follow-up consultation"
              value={formData.reason}
              onChange={(e) => handleInputChange('reason', e.target.value)}
            />
          </div>

          {/* Symptoms */}
          <div className="space-y-2">
            <Label htmlFor="symptoms">Symptoms (Optional)</Label>
            <Textarea
              id="symptoms"
              placeholder="Describe your symptoms (separate multiple symptoms with commas)"
              value={formData.symptoms}
              onChange={(e) => handleInputChange('symptoms', e.target.value)}
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Booking...
                </>
              ) : (
                'Book Appointment'
              )}
            </Button>
          </div>
        </form>

        {/* Quick Info */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
          <strong>Note:</strong> Your appointment request will be sent to the doctor for confirmation. 
          You'll receive a notification once it's approved. For emergencies, please call our 24/7 helpline.
        </div>
      </DialogContent>
    </Dialog>
  );
}
