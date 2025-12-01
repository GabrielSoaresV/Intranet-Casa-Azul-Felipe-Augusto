export interface UserResponse {
  id: number;
  username: string;
  cpf?: string;
  email: string;
  profileImage: string;
  roles: string[];
}
