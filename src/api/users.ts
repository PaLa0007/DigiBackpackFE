export const fetchSchoolAdmins = async (schoolId: number) => {
    const response = await fetch(`http://localhost:8165/api/users/by-school/${schoolId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch school admins');
    }
    return response.json();
};

export const registerSchoolAdmin = async (schoolId: number, adminData: any) => {
    const response = await fetch(`http://localhost:8165/api/users/register-admin/${schoolId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminData),
    });

    if (!response.ok) {
        throw new Error('Failed to register school admin');
    }

    return response.json();
};

export const updateSchoolAdmin = async (adminId: number, updates: any) => {
    const response = await fetch(`http://localhost:8165/api/users/${adminId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
    });

    if (!response.ok) {
        throw new Error('Failed to update school admin');
    }

    return response.json();
};

export const deleteSchoolAdmin = async (adminId: number) => {
    const response = await fetch(`http://localhost:8165/api/users/${adminId}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('Failed to delete school admin');
    }
};

