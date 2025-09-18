

import ManagementTable from "@/components/dashboard/admin/management-table";
import { doctors } from "@/lib/placeholder-data";

export default function ManageDoctorsPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <ManagementTable
                title="Manage Doctors"
                description="View, add, edit, or remove doctor accounts."
                data={doctors}
                userType="Doctor"
            />
        </div>
    );
}
