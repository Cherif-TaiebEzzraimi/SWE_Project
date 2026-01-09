// src/api/requestApi.ts
// Use your existing apiClient instead of creating new instance
import apiClient from '../lib/axios';

export interface RequestData {
  id?: number;
  title: string;
  category: string;
  budget_min: number;
  budget_max: number;
  description?: string;
  attachments?: any[];
  status?: string;
  created_at?: string;
  updated_at?: string;
  client?: any;
}

export interface CreateRequestPayload {
  title: string;
  category: string;
  budget_min: number;
  budget_max: number;
  description?: string;
  attachments?: any[];
}

/**
 * Get all requests (for freelancers to browse)
 * or get current client's requests (for clients to manage)
 */
export const getRequests = async (params?: { own_only?: string }): Promise<RequestData[]> => {
  try {
    console.log('Fetching requests with params:', params);
    const response = await apiClient.get('/requests/', { params });
    console.log('Requests response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching requests:', error);
    console.error('Error response:', error.response);
    console.error('Error status:', error.response?.status);
    console.error('Error data:', error.response?.data);
    throw new Error(error.response?.data?.detail || 'Failed to fetch requests');
  }
};

/**
 * Get requests for a specific client
 */
export const getClientRequests = async (clientId: number): Promise<RequestData[]> => {
  try {
    const response = await apiClient.get(`/requests/client/${clientId}/`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching client requests:', error);
    throw new Error(error.response?.data?.detail || 'Failed to fetch client requests');
  }
};

/**
 * Get a single request by ID
 */
export const getRequest = async (requestId: number): Promise<RequestData> => {
  try {
    const response = await apiClient.get(`/requests/${requestId}/`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching request:', error);
    throw new Error(error.response?.data?.detail || 'Failed to fetch request');
  }
};

/**
 * Create a new request (client only)
 */
export const createRequest = async (payload: CreateRequestPayload): Promise<RequestData> => {
  try {
    const response = await apiClient.post('/requests/', payload);
    return response.data;
  } catch (error: any) {
    console.error('Error creating request:', error);
    throw new Error(error.response?.data?.detail || 'Failed to create request');
  }
};

/**
 * Update a request
 */
export const updateRequest = async (
  requestId: number, 
  payload: Partial<CreateRequestPayload>
): Promise<RequestData> => {
  try {
    const response = await apiClient.put(`/requests/${requestId}/`, payload);
    return response.data;
  } catch (error: any) {
    console.error('Error updating request:', error);
    throw new Error(error.response?.data?.detail || 'Failed to update request');
  }
};

/**
 * Delete (cancel) a request
 */
export const deleteRequest = async (requestId: number): Promise<void> => {
  try {
    await apiClient.delete(`/requests/${requestId}/`);
  } catch (error: any) {
    console.error('Error deleting request:', error);
    throw new Error(error.response?.data?.detail || 'Failed to delete request');
  }
};

/**
 * Create negotiation from a request (freelancer applies)
 */
export const applyToRequest = async (
  requestId: number, 
  freelancerId: number,
  freelancerAttachments?: any[]
): Promise<any> => {
  try {
    const payload: any = {
      freelancer_id: freelancerId,
    };
    
    if (freelancerAttachments && freelancerAttachments.length > 0) {
      payload.freelancer_attachments = freelancerAttachments;
    }
    
    const response = await apiClient.post(`/negotiations/${requestId}/create/`, payload);
    return response.data;
  } catch (error: any) {
    console.error('Error applying to request:', error);
    throw new Error(error.response?.data?.detail || 'Failed to apply to request');
  }
};

export default {
  getRequests,
  getClientRequests,
  getRequest,
  createRequest,
  updateRequest,
  deleteRequest,
  applyToRequest,
};