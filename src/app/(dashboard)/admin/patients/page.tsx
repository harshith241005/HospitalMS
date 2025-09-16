import ManagementTable from "@/components/dashboard/admin/management-table";
import type { Patient } from "@/lib/types";

async function getPatients(): Promise<Patient[]> {
  // This function now fetches data from your local backend.
  // Make sure your backend server is running and provides data at this endpoint.
  try {
    // Replace 'http://localhost:3001/api/patients' with your actual backend endpoint if different.
    const response = await fetch('http://localhost:3001/api/patients', { 
      cache: 'no-store' // Ensures fresh data is fetched on every request
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch patients. Status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Error fetching patients:", error);
    // Return an empty array on error to prevent the page from crashing.
    return []; 
  }
}

export default async function ManagePatientsPage() {
    const patientsData = await getPatients();

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <ManagementTable
                title="Manage Patients"
                description="View, add, edit, or remove patient accounts."
                data={patientsData}
                userType="Patient"
            />
        </div>
    );
}
