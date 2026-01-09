// src/api/negotiationApi.ts
import apiClient from '../lib/axios';

export interface CreateDirectHireData {
  freelancer_id: number;
  client_description?: string;
  client_attachments?: any[];
}

export interface NegotiationResponse {
  id: number;
  origin_type: string;
  client_id?: number;
  freelancer_id?: number;
  request?: {
    id: number;
    title: string;
    category: string;
    budget_min: number;
    budget_max: number;
  };
  client?: {
    id: number;
    user: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
    };
  };
  freelancer?: {
    id: number;
    user: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
    };
    profile_picture?: string;
  };
  client_description?: string;
  client_attachments?: any[];
  status: string;
  client_agreed: boolean;
  freelancer_agreed: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Get all negotiations for the current user
 */
export const getNegotiations = async (): Promise<NegotiationResponse[]> => {
  try {
    // This endpoint may not exist yet - you'll need to add it to backend
    const response = await apiClient.get<NegotiationResponse[]>('/negotiations/');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching negotiations:', error);
    // Return empty array if endpoint doesn't exist yet
    return [];
  }
};

/**
 * Get negotiation details
 * GET /negotiations/:id/
 */
export const getNegotiation = async (negotiationId: number): Promise<NegotiationResponse> => {
  const response = await apiClient.get<NegotiationResponse>(`/negotiations/${negotiationId}/`);
  return response.data;
};

/**
 * Create a direct hire negotiation
 * POST /negotiations/directhire/:freelancer_id/
 */
export const createDirectHire = async (
  freelancerId: number,
  data?: { client_description?: string; client_attachments?: any[] }
): Promise<NegotiationResponse> => {
  const response = await apiClient.post<NegotiationResponse>(
    `/negotiations/directhire/${freelancerId}/`,
    data || {}
  );
  return response.data;
};

/**
 * Update negotiation
 * PUT /negotiations/:id/
 */
export const updateNegotiation = async (
  negotiationId: number,
  data: Partial<NegotiationResponse>
): Promise<NegotiationResponse> => {
  const response = await apiClient.put<NegotiationResponse>(
    `/negotiations/${negotiationId}/`,
    data
  );
  return response.data;
};

/**
 * Decline a negotiation
 * POST /negotiations/:id/decline/
 */
export const declineNegotiation = async (
  negotiationId: number,
  reason: string = ''
): Promise<NegotiationResponse> => {
  try {
    const response = await apiClient.post<NegotiationResponse>(
      `/negotiations/${negotiationId}/decline/`,
      { reason }
    );
    return response.data;
  } catch (error: any) {
    console.error('Error declining negotiation:', error);
    throw new Error(error.response?.data?.detail || 'Failed to decline negotiation');
  }
};

/**
 * Agree to a negotiation
 * POST /negotiations/:id/agree/
 */
export const agreeNegotiation = async (negotiationId: number): Promise<NegotiationResponse> => {
  try {
    const response = await apiClient.post<NegotiationResponse>(
      `/negotiations/${negotiationId}/agree/`
    );
    return response.data;
  } catch (error: any) {
    console.error('Error agreeing to negotiation:', error);
    throw new Error(error.response?.data?.detail || 'Failed to agree to negotiation');
  }
};

/**
 * Add a phase to negotiation
 * POST /negotiations/:id/phases/
 */
export const addNegotiationPhase = async (
  negotiationId: number,
  phaseData: {
    title: string;
    description?: string;
    budget?: number;
    deadline?: string;
    deliverables?: string;
  }
): Promise<any> => {
  try {
    const response = await apiClient.post(
      `/negotiations/${negotiationId}/phases/`,
      phaseData
    );
    return response.data;
  } catch (error: any) {
    console.error('Error adding phase:', error);
    throw new Error(error.response?.data?.detail || 'Failed to add phase');
  }
};

export default {
  getNegotiations,
  getNegotiation,
  createDirectHire,
  updateNegotiation,
  declineNegotiation,
  agreeNegotiation,
  addNegotiationPhase,
};