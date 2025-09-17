import ManagementTable from "@/components/dashboard/admin/management-table";
import type { User } from "@/lib/types";

// This would typically come from an API call
const staff: User[] = [
    { id: 'staff-1', name: 'Grace Hopper', email: 'grace.h@meditrack.pro', role: 'patient', avatarUrl: 'https://picsum.photos/seed/avatar5/200/200', dataAiHint: 'nurse woman' },
    { id: 'staff-2', name: 'Charles Babbage', email: 'charles.b@meditrack.pro', role: 'patient', avatarUrl: 'https://picsum.photos/seed/avatar6/200/200', dataAiHint: 'nurse man' },
];


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
