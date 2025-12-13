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