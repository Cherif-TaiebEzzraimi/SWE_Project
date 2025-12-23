import apiClient from '../lib/axios';

/* =========================
   Register Company
========================= */
export const registerCompany = async (data: any) => {
  const response = await apiClient.post('/auth/register/company/', data);
  return response.data;
};

/* =========================
   Company DTO (matches backend)
========================= */
export interface Company {
  id: number;                 // ✅ company.id
  user: number;               // ✅ user.id (owner)
  registration_number: string;
  tax_id: string | null;
  representative: string | null;
  business_type: string | null;
  logo: string | null;
  description: string | null;
  industry: string | null;
  is_verified: boolean;
}

/* =========================
   GET company (by USER ID)
========================= */
export const getCompany = async (userId: number): Promise<Company> => {
  const response = await apiClient.get<Company>(`/companies/${userId}/`);
  return response.data;
};

/* =========================
   Update payload
========================= */
export interface UpdateCompanyPayload {
  description?: string | null;
  business_type?: string | null;
  tax_id?: string | null;
  representative?: string | null;
  industry?: string | null;
}

/* =========================
   UPDATE company (by COMPANY ID)
========================= */
export const updateCompanyProfile = async (
  companyId: number,
  data: UpdateCompanyPayload
): Promise<Company> => {
  const response = await apiClient.put<Company>(
    `/companies/${companyId}/update/`,
    data
  );
  return response.data;
};

/* =========================
   Upload company logo (by COMPANY ID)
========================= */
export const uploadCompanyLogo = async (
  companyId: number,
  file: File
): Promise<Company> => {
  const formData = new FormData();
  formData.append('logo', file);

  const response = await apiClient.put<Company>(
    `/companies/${companyId}/update/`,
    formData
  );

  return response.data;
};

/* =========================
   Check if user is a company
========================= */
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
