export interface Trigger {
  id: string;
  name: string;
  keyword: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}