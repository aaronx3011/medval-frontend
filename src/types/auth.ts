export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: string;
  created_at?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ResetStatusResponse {
  forceReset: boolean;
  expiresAt?: string;
}
