export type Trigger = {
  id: string;
  name: string;
  keyword: string;
  condition: string;
  action: string;
  status: 'active' | 'inactive';
  created_at: string;
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