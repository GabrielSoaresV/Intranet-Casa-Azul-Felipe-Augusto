export interface Profile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'attendant';
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Citizen {
  id: string;
  name: string;
  email: string;
  phone?: string;
  cpf: string;
  address?: string;
  created_at: string;
  created_by?: string;
}

export interface Demand {
  id: string;
  citizen_id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  category: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  citizen?: Citizen;
  assigned_user?: Profile;
}

export interface Message {
  id: string;
  demand_id: string;
  user_id: string;
  message: string;
  created_at: string;
  user?: Profile;
}

export interface DemandHistory {
  id: string;
  demand_id: string;
  user_id: string;
  action: 'created' | 'updated' | 'assigned' | 'completed' | 'cancelled';
  old_status?: string;
  new_status?: string;
  notes?: string;
  created_at: string;
  user?: Profile;
}
