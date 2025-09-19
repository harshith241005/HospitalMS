
'use client';

import { useState } from 'react';
import { summarizeAndExplainPrescription, SummarizeAndExplainPrescriptionOutput } from '@/ai/flows/summarize-and-explain-prescription';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BrainCircuit, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface PrescriptionExplainerProps {
    prescriptionText: string;
}

export function PrescriptionExplainer({ prescriptionText }: PrescriptionExplainerProps) {
    const [result, setResult] = useState<SummarizeAndExplainPrescriptionOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const handleExplain = async () => {
        if(result) return;
        
        setIsLoading(true);
        setError(null);
        try {
            const explanation = await summarizeAndExplainPrescription({ prescriptionText });
            setResult(explanation);
        } catch (e) {
            setError('Failed to get explanation. Please try again.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="w-full" onClick={handleExplain}>
                    {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <BrainCircuit className="mr-2 h-4 w-4" />
                    )}
                    Explain with AI
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>AI Prescription Helper</DialogTitle>
                    <DialogDescription>
                        This tool provides a simplified explanation of your prescription. This is not medical advice. Always consult your doctor.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center space-y-2 p-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-muted-foreground">Analyzing your prescription...</p>
                        </div>
                    )}
                    {error && (
                        <Alert variant="destructive">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    {result && (
                        <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
                            <AccordionItem value="item-1">
                                <AccordionTrigger className="text-lg font-semibold">Summary</AccordionTrigger>
                                <AccordionContent className="text-base">
                                    {result.summary}
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger className="text-lg font-semibold">Detailed Explanation</AccordionTrigger>
                                <AccordionContent className="prose dark:prose-invert max-w-none text-base">
                                     <div dangerouslySetInnerHTML={{ __html: result.explanation.replace(/\n/g, '<br />') }} />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
