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
 * Get negotiation details
 * GET /negotiations/:id/
 */
export const getNegotiation = async (negotiationId: number): Promise<NegotiationResponse> => {
  const response = await apiClient.get<NegotiationResponse>(`/negotiations/${negotiationId}/`);
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
  const response = await apiClient.put<NegotiationResponse>(`/negotiations/${negotiationId}/`, data);
  return response.data;
};

