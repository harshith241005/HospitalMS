import ManagementTable from "@/components/dashboard/admin/management-table";
import { patients } from "@/lib/placeholder-data";

export default function ManagePatientsPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <ManagementTable
                title="Manage Patients"
                description="View, add, edit, or remove patient accounts."
                data={patients}
                userType="Patient"
            />
        </div>
    );
}
