export interface Note {
  id: string;
  title: string;
  content: string;
  status: 'active' | 'done';
  date: string; 
}


export type FolderType = 'private' | 'pre_work' | 'general';
