import apiClient from '../lib/axios';

export interface ProjectResponse {
  id: number;
  title: string;
  negotiation: {
    id: number;
    origin_type: string;
    client: {
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
    status: string;
    client_agreed: boolean;
    freelancer_agreed: boolean;
    created_at: string;
    updated_at: string;
  };
  start_date?: string | null;
  end_date?: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Get projects for a user (client or freelancer)
 * GET /projects/user/:user_id/
 */
export const getUserProjects = async (userId: number): Promise<ProjectResponse[]> => {
  console.log('🔍 Fetching projects for user:', userId);
  const response = await apiClient.get<ProjectResponse[]>(`/projects/user/${userId}/`);
  console.log('📊 Projects response:', response.data);
  return response.data;
};

/**
 * Get project details
 * GET /projects/:id/
 */
export const getProject = async (projectId: number): Promise<any> => {
  const response = await apiClient.get(`/projects/${projectId}/`);
  return response.data;
};

