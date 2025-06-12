export interface TaskRq {
  userId: number | null;
  title: string;
  description?: string;
  startEventDate: string;
  endEventDate: string;
  createdAt?: string;
  updatedAt?: string;
  priority: number; 
  status: number;
  category: number;
}