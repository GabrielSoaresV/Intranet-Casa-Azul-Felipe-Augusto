export interface Profile {
  cpf: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: 'ADMIN' | 'ATTENDANT' | 'CITIZEN';
  avatar?: any;
  createdAt?: string;
  updatedAt?: string;
}
