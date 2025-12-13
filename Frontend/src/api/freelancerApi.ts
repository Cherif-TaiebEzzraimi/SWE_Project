// src/api/freelancerApi.ts
import apiClient from "../lib/axios";

export interface FreelancerUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface FreelancerProfile {
  user: FreelancerUser;
  phone_number: string | null;
  city: string | null;
  wilaya: string | null;
  description: string | null;
  categories: string[] | null;
  skills: string[] | null;
  years_experience: number | null;
  social_links: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
    [key: string]: string | undefined;
  } | null;
  ccp_account: string | null;
  barid_account: string | null;
  profile_picture: string | null;
  rate: number | null;
  national_id: string | null;
  cvatta: string | null;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }> | null;
}

// You already have this, keep it:
export const registerFreelancer = async (data: any) => {
  const response = await apiClient.post("/auth/register/freelancer/", data);
  return response.data;
};

// NEW: get profile
export const getFreelancerProfile = async (
  userId: number
): Promise<FreelancerProfile> => {
  const response = await apiClient.get<FreelancerProfile>(
    `/freelancers/${userId}/`
  );
  return response.data;
};

// Update payload type - only fields that can be updated
export interface UpdateFreelancerPayload {
  first_name?: string;
  last_name?: string;
  phone_number?: string | null;
  city?: string | null;
  wilaya?: string | null;
  description?: string | null;
  categories?: string[] | null;
  skills?: string[] | null;
  years_experience?: number | null;
  national_id?: string | null;
  social_links?: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
    [key: string]: string | undefined;
  } | null;
  ccp_account?: string | null;
  barid_account?: string | null;
  education?: Array<{
    degree: string;
    institution: string;
    year: string;
  }> | null;
}

// NEW: update profile (partial update)
export const updateFreelancerProfile = async (
  userId: number,
  data: UpdateFreelancerPayload
): Promise<FreelancerProfile> => {
  const response = await apiClient.put<FreelancerProfile>(
    `/freelancers/${userId}/update/`,
    data
  );
  return response.data;
};

// Upload profile photo
export const uploadFreelancerPhoto = async (
  userId: number,
  photoFile: File
): Promise<FreelancerProfile> => {
  const formData = new FormData();
  formData.append('profile_picture', photoFile);
  
  const response = await apiClient.post<FreelancerProfile>(
    `/freelancers/${userId}/upload-photo/`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

// Delete profile photo
export const deleteFreelancerPhoto = async (
  userId: number
): Promise<{ detail: string }> => {
  const response = await apiClient.delete<{ detail: string }>(
    `/freelancers/${userId}/photo/`
  );
  return response.data;
};
