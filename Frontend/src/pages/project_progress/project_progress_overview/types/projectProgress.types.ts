export interface Project {
  id: string;
  negotiation_id: string;
  status: 'in progress' | 'done';
  start_date: string | null;
  end_date: string | null;
  created_at: string;
}

export interface Negotiation {
  id: string;
  client_id: string;
  freelancer_id: string;
  client_description: string;
  client_attachments: string[];
  status: 'ongoing' | 'agreed' | 'declined';
  created_at: string;
}

export interface MediaFile {
  id: string;
  file_url: string;
  file_type: string;
  file_name: string;
  file_size: number;
  created_at: string;
}

export interface Freelancer {
  user_id: string;
  first_name: string;
  last_name: string;
  profile_photo: string;
  role: string;
}

export interface FileForUpload {
  file: File;
  id: string;
  name: string;
  size: number;
  type: string;
}
