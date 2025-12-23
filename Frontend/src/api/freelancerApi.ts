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

export interface MediaFile {
  id: number;
  owner?: FreelancerUser;
  entity_type: string;
  entity_id: number;
  file_url: string;
  file_type: string;
  created_at: string;
}


export const registerFreelancer = async (data: any) => {
  const response = await apiClient.post("/auth/register/freelancer/", data);
  return response.data;
};


export const getFreelancerProfile = async (
  userId: number
): Promise<FreelancerProfile> => {
  const response = await apiClient.get<FreelancerProfile>(
    `/freelancers/${userId}/`
  );
  return response.data;
};


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
  cvatta?: string | null;
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


export const uploadFreelancerPhoto = async (
  userId: number,
  photoFile: File
): Promise<FreelancerProfile> => {
  const formData = new FormData();
  formData.append('photo', photoFile);

  const response = await apiClient.post(
    `/freelancers/${userId}/upload-photo/`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );

  return response.data;
};


export const uploadFreelancerCV = async (
  userId: number,
  file: File
): Promise<MediaFile> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('entity_type', 'freelancer');
  formData.append('entity_id', userId.toString());

  const response = await apiClient.post<MediaFile>(
    '/media/upload/',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );

  return response.data;
};


export const listFreelancerMedia = async (userId: number): Promise<MediaFile[]> => {
  const response = await apiClient.get<MediaFile[]>(`/media/freelancer/${userId}/`);
  return response.data;
};

export const deleteMedia = async (mediaId: number): Promise<{ detail: string }> => {
  const response = await apiClient.delete<{ detail: string }>(`/media/${mediaId}/`);
  return response.data;
};

// Delete freelancer profile photo (via media)
export const deleteFreelancerPhoto = async (
  userId: number
): Promise<{ detail: string }> => {
  const media = await listFreelancerMedia(userId);
  const candidate = media
    .filter((m) => (m.file_type || '').startsWith('image/'))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
  if (!candidate) {
    return { detail: 'No profile photo found' };
  }
  return deleteMedia(candidate.id);
};
