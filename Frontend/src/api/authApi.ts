export interface RegisterClientCompanyRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  registration_number: string;
  business_type: string;
}

export const registerClientCompany = async (data: RegisterClientCompanyRequest): Promise<RegisterResponse> => {
  const response = await apiClient.post<RegisterResponse>('/auth/register/company/', data);
  return response.data;
};

export interface RegisterClientIndividualRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  client: {
    phone_number?: string;
    city?: string;
    wilaya?: string;
  };
}

export const registerClientIndividual = async (data: RegisterClientIndividualRequest): Promise<RegisterResponse> => {
  const response = await apiClient.post<RegisterResponse>('/auth/register/client/', data);
  return response.data;
};
import apiClient from '../lib/axios';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  detail: string;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    created_at: string;
    updated_at: string;
  };
}

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>('/auth/login/', data);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await apiClient.post('/auth/logout/');
};

export interface RegisterFreelancerRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  freelancer?: {
    phone_number?: string;
    city?: string;
    wilaya?: string;
  };
}

export interface RegisterResponse {
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    created_at: string;
    updated_at: string;
  };
}

export const registerFreelancer = async (data: RegisterFreelancerRequest): Promise<RegisterResponse> => {
  const response = await apiClient.post<RegisterResponse>('/auth/register/freelancer/', data);
  return response.data;
};