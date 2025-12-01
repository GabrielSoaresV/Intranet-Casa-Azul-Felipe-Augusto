export interface UserDetailsResponse {
  id: number;
  username: string;
  cpf: string;
  email: string;
  profileImage: string;
  enabled: boolean;
  roles: string[];
}
