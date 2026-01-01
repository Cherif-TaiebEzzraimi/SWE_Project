import apiClient from '../lib/axios';

export interface MediaFile {
  id: number;
  owner?: number;
  entity_type: string;
  entity_id: number;
  file_url: string;
  file_type: string;
  created_at: string;
}

/**
 * Upload a file to the media endpoint
 * POST /media/upload/
 */
export const uploadMedia = async (
  file: File,
  entityType: string,
  entityId: number
): Promise<MediaFile> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('entity_type', entityType);
  formData.append('entity_id', entityId.toString());

  const response = await apiClient.post<MediaFile>(
    '/media/upload/',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );

  return response.data;
};

/**
 * List media files for an entity
 * GET /media/:entity_type/:entity_id/
 */
export const listMedia = async (
  entityType: string,
  entityId: number
): Promise<MediaFile[]> => {
  const response = await apiClient.get<MediaFile[]>(
    `/media/${entityType}/${entityId}/`
  );
  return response.data;
};

