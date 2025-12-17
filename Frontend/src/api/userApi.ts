import apiClient from '../lib/axios';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role?: string;
}

// Backend supports only soft-deactivation for /users/<id>/
export const deactivateUser = async (id: number): Promise<{ detail: string }> => {
  const response = await apiClient.delete<{ detail: string }>(`/users/${id}/`);
  return response.data;
};
