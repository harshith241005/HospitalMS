
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { doctors } from "@/lib/placeholder-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Video, Mic, MicOff, VideoOff, PhoneOff, Send } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function VideoConsultationPage() {
    const [isMicMuted, setIsMicMuted] = useState(false);
    const [isCamOff, setIsCamOff] = useState(false);
    const [hasCameraPermission, setHasCameraPermission] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);
    const { toast } = useToast();

    useEffect(() => {
        const getCameraPermission = async () => {
          if (!navigator.mediaDevices?.getUserMedia) {
            console.error('Camera API not supported in this browser.');
            setHasCameraPermission(false);
            return;
          }
          try {
            const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
            setHasCameraPermission(true);
    
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          } catch (error) {
            console.error('Error accessing camera:', error);
            setHasCameraPermission(false);
            toast({
              variant: 'destructive',
              title: 'Camera Access Denied',
              description: 'Please enable camera permissions in your browser settings to use this feature.',
            });
          }
        };
    
        getCameraPermission();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        }
      }, [toast]);

    const toggleMic = () => setIsMicMuted(!isMicMuted);
    const toggleCam = () => setIsCamOff(!isCamOff);

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight font-headline">Video Consultation</h2>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Live Consultation</CardTitle>
                            <CardDescription>Connect with your doctor in real-time.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="relative aspect-video bg-black rounded-md flex items-center justify-center">
                                <video ref={videoRef} className="w-full h-full object-cover rounded-md" autoPlay muted playsInline />
                                {!hasCameraPermission && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white">
                                        <VideoOff className="w-16 h-16 mb-4" />
                                        <p className="text-lg">Camera access is required.</p>
                                        <p className="text-sm text-muted-foreground">Please grant permission in your browser.</p>
                                    </div>
                                )}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 p-2 bg-black/50 rounded-full">
                                    <Button variant="ghost" size="icon" className="rounded-full bg-white/20 hover:bg-white/30 text-white" onClick={toggleMic}>
                                        {isMicMuted ? <MicOff /> : <Mic />}
                                    </Button>
                                    <Button variant="destructive" size="icon" className="rounded-full h-12 w-12">
                                        <PhoneOff />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="rounded-full bg-white/20 hover:bg-white/30 text-white" onClick={toggleCam}>
                                        {isCamOff ? <VideoOff /> : <Video />}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Prepare for your call</CardTitle>
                            <CardDescription>Let the doctor know what you'd like to discuss.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="doctor-select">Choose a Doctor</Label>
                                    <Select>
                                        <SelectTrigger id="doctor-select">
                                            <SelectValue placeholder="Select a doctor" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {doctors.map(doctor => (
                                                <SelectItem key={doctor.id} value={doctor.id}>
                                                    Dr. {doctor.name} ({doctor.specialization})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="symptoms">Describe your symptoms</Label>
                                    <Textarea id="symptoms" placeholder="e.g., I have a sore throat and a slight fever..." rows={5} />
                                </div>
                                <Button className="w-full">
                                    <Send className="mr-2 h-4 w-4" /> Start Consultation
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
