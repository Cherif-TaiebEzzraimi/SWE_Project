import axios from '../lib/axios';

export interface RequestData {
  id?: number;
  title: string;
  category: string;
  description?: string;
  budget_min: number;
  budget_max: number;
  attachments?: string[];
  status?: string;
  created_at?: string;
  updated_at?: string;
}

// Create a new request
export const createRequest = async (data: Omit<RequestData, 'id' | 'created_at' | 'updated_at'>): Promise<RequestData> => {
  const response = await axios.post('/requests/', data);
  return response.data;
};

// Get all requests for the logged-in user
export const getRequests = async (): Promise<RequestData[]> => {
  const response = await axios.get('/requests/');
  return response.data;
};

// Get requests for a specific client
export const getClientRequests = async (clientId: number): Promise<RequestData[]> => {
  const response = await axios.get(`/requests/client/${clientId}/`);
  return response.data;
};

// Get a single request by ID
export const getRequest = async (id: number): Promise<RequestData> => {
  const response = await axios.get(`/requests/${id}/`);
  return response.data;
};

// Update a request
export const updateRequest = async (id: number, data: Partial<RequestData>): Promise<RequestData> => {
  const response = await axios.put(`/requests/${id}/`, data);
  return response.data;
};

// Delete a request
export const deleteRequest = async (id: number): Promise<void> => {
  await axios.delete(`/requests/${id}/`);
};
