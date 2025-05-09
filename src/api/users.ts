export const fetchSchoolAdmins = async (schoolId: number) => {
    const response = await fetch(`http://localhost:8165/api/users/by-school/${schoolId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch school admins');
    }
    return response.json();
};