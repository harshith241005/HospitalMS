
import ManagementTable from "@/components/dashboard/admin/management-table";
import type { Doctor } from "@/lib/types";

async function getDoctors(): Promise<Doctor[]> {
  // This function now fetches data from your local backend.
  // Make sure your backend server is running and provides data at this endpoint.
  try {
    // Replace 'http://localhost:3001/api/doctors' with your actual backend endpoint.
    const response = await fetch('http://localhost:3001/api/doctors', { 
      cache: 'no-store' // Ensures fresh data is fetched on every request
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch doctors. Status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Error fetching doctors:", error);
    // Return an empty array on error to prevent the page from crashing.
    // You might want to implement more robust error handling here.
    return []; 
  }
}


export default async function ManageDoctorsPage() {
    const doctorsData = await getDoctors();

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <ManagementTable
                title="Manage Doctors"
                description="View, add, edit, or remove doctor accounts."
                data={doctorsData}
                userType="Doctor"
            />
        </div>
    );
}
