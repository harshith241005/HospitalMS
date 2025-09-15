import ManagementTable from "@/components/dashboard/admin/management-table";
import { staff } from "@/lib/placeholder-data";

export default function ManageStaffPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <ManagementTable
                title="Manage Staff"
                description="View, add, edit, or remove staff accounts."
                data={staff}
                userType="Staff"
            />
        </div>
    );
}
