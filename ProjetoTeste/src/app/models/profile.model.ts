export interface Profile {
  cpf: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: 'ADMIN' | 'ATTENDANT' | 'CITIZEN';
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}
