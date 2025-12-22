import apiClient from '../lib/axios';

export const registerCompany = async (data: any) => {
  const response = await apiClient.post('/auth/register/company/', data);
  return response.data;
};

export interface Company {
  // Backend CompanySerializer uses fields='__all__', so `user` is the user PK.
  user: number;
  registration_number: string;
  tax_id: string | null;
  representative: string | null;
  business_type: string | null;
  logo: string | null;
  description: string | null;
  industry: string | null;
  is_verified: boolean;
}

export const getCompany = async (id: number): Promise<Company> => {
  const response = await apiClient.get<Company>(`/companies/${id}/`);
  return response.data;
};

export interface UpdateCompanyPayload {
  description?: string | null;
  business_type?: string | null;
  tax_id?: string | null;
  representative?: string | null;
  industry?: string | null;
}

export const updateCompanyProfile = async (
  userId: number,
  data: UpdateCompanyPayload
): Promise<Company> => {
  const response = await apiClient.put<Company>(`/companies/${userId}/update/`, data);
  return response.data;
};

// Upload company logo (Company.logo is an ImageField on backend)
export const uploadCompanyLogo = async (
  userId: number,
  file: File
): Promise<Company> => {
  const formData = new FormData();
  formData.append('logo', file);

  const response = await apiClient.put<Company>(
    `/companies/${userId}/update/`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );

  return response.data;
};

// Helper to check if a user ID has a company profile
export const isCompany = async (userId: number): Promise<boolean> => {
  try {
    await apiClient.get(`/companies/${userId}/`);
    return true;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return false;
    }
    throw error;
  }
};