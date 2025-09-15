import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Prescription } from "@/lib/types";
import { BrainCircuit, Pill, Stethoscope } from "lucide-react";
import { format } from "date-fns";
import { PrescriptionExplainer } from "./prescription-explainer";

interface PrescriptionCardProps {
    prescription: Prescription;
}

export default function PrescriptionCard({ prescription }: PrescriptionCardProps) {
    return (
        <Card className="flex flex-col">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg">{prescription.medications.map(m => m.name).join(', ')}</CardTitle>
                        <CardDescription>Prescribed on {format(prescription.date, "MMMM d, yyyy")}</CardDescription>
                    </div>
                    <Pill className="h-8 w-8 text-primary" />
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
                <div className="text-sm text-muted-foreground space-y-4">
                    <div className="flex items-start">
                        <Stethoscope className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                        <div>
                            <span className="font-semibold text-foreground">Prescribed by:</span> Dr. {prescription.doctor.name}
                        </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                        {prescription.medications.map((med, index) => (
                            <div key={index}>
                                <p className="font-semibold text-foreground">{med.name}</p>
                                <p><strong>Dosage:</strong> {med.dosage}</p>
                                <p><strong>Frequency:</strong> {med.frequency}</p>
                            </div>
                        ))}
                    </div>
                    {prescription.notes && (
                         <>
                            <Separator />
                            <div>
                                <p className="font-semibold text-foreground">Doctor's Notes:</p>
                                <p>{prescription.notes}</p>
                            </div>
                        </>
                    )}
                </div>
            </CardContent>
            <CardFooter>
                <PrescriptionExplainer prescriptionText={prescription.fullText} />
            </CardFooter>
        </Card>
    );
}
