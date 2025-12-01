export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType?: string; // "Bearer" por padrão
}
