export type Trigger = {
  id: string;
  postId: string;
  keyword: string;
  isActive: boolean;
  createdAt: Date;
  userId: string;
  templateId: string;
};

export type Database = {
  public: {
    Tables: {
      triggers: {
        Row: Trigger;
        Insert: Omit<Trigger, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<Trigger, 'id' | 'created_at'>> & {
          id?: string;
          created_at?: string;
        };
      };
      // Add other tables as needed
    };
  };
};