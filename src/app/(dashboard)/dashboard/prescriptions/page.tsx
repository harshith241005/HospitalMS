import PrescriptionCard from "@/components/dashboard/patient/prescription-card";
import { prescriptions } from "@/lib/placeholder-data";

export default function PrescriptionsPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight font-headline">My Prescriptions</h2>
            </div>
            <p className="text-muted-foreground">
                Here is a list of all your medical prescriptions. Use the AI tool to get a simple explanation.
            </p>
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                {prescriptions.map((prescription) => (
                    <PrescriptionCard key={prescription.id} prescription={prescription} />
                ))}
            </div>
             {prescriptions.length === 0 && (
                <div className="flex flex-col items-center justify-center text-center py-12 border-2 border-dashed rounded-lg">
                    <h3 className="text-xl font-semibold">No Prescriptions Found</h3>
                    <p className="text-muted-foreground mt-2">Your prescriptions from your doctor will appear here.</p>
                </div>
            )}
        </div>
    );
}
