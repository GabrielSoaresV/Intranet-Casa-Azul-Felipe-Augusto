// Profile.ts
export interface Profile {
  cpf: string; // chave primária do backend
  name: string;
  email: string;
  password?: string; // incluído para login/CRUD
  phone?: string;
  role: 'ADMIN' | 'ATTENDANT' | 'CITIZEN';
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Demand.ts
export interface Demand {
  id: string;
  creatorCpf: string; // relacionamento com Profile (creator)
  assignedUserCpf?: string; // relacionamento com Profile (assignedUser)
  title: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  category?: string;
  createdAt: string;
  updatedAt: string;
  createdByCpf?: string; // quem criou o registro
  updatedByCpf?: string; // quem atualizou o registro
  creator?: Profile;
  assignedUser?: Profile;
}

// Message.ts
export interface Message {
  id: string;
  demandId: string;
  userCpf: string;
  message: string;
  createdAt: string;
  user?: Profile;
  demand?: Demand;
}

// DemandHistory.ts
export interface DemandHistory {
  id: string;
  demandId: string;
  userCpf?: string; // usuário principal
  performedByCpf?: string; // usuário que realizou a ação
  action: 'CREATED' | 'UPDATED' | 'ASSIGNED' | 'COMPLETED' | 'CANCELLED';
  oldStatus?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  newStatus?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  createdAt: string;
  user?: Profile;
  performedBy?: Profile;
  demand?: Demand;
}
