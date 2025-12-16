import apiClient from '../lib/axios';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role?: string;
}

export interface UpdateUserRequest {
  first_name?: string;
  last_name?: string;
  email?: string; // not editing via company profile, but keeps type flexible
}

export const updateUser = async (id: number, data: UpdateUserRequest): Promise<User> => {
  const response = await apiClient.put<User>(`/users/${id}/`, data);
  return response.data;
};
