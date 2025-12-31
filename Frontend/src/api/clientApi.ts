export const registerClient = async (data: any) => {
  const response = await apiClient.post("/auth/register/client/", data);
  return response.data;
};
import apiClient from '../lib/axios';

export interface Client {
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
  };
  profile_picture: string | null;
  phone_number: string | null;
  city: string | null;
  wilaya: string | null;
}

export const getClient = async (id: number): Promise<Client> => {
  const response = await apiClient.get<Client>(`/clients/${id}/`);
  return response.data;
};

export interface UpdateClientPayload {
  first_name?: string;
  last_name?: string;
  phone_number?: string | null;
  city?: string | null;
  wilaya?: string | null;
}

export const updateClientProfile = async (
  userId: number,
  data: UpdateClientPayload
): Promise<Client> => {
  const response = await apiClient.put<Client>(`/clients/${userId}/update/`, data);
  return response.data;
};

export interface UploadClientPhotoResponse {
  detail: string;
  photo_url: string;
  client: Client;
}

export const uploadClientPhoto = async (
  userId: number,
  photoFile: File
): Promise<UploadClientPhotoResponse> => {
  const formData = new FormData();
  formData.append('photo', photoFile);

  const response = await apiClient.post<UploadClientPhotoResponse>(
    `/clients/${userId}/upload-photo/`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );

  return response.data;
};