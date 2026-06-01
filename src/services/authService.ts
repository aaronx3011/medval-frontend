import { apiClient } from './apiClient';
import type { AuthResponse, ResetStatusResponse } from '../types/auth';

export const authService = {
  login(username: string, password: string) {
    return apiClient<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  register(data: {
    username: string;
    email: string;
    password: string;
    fullName: string;
    role?: string;
  }) {
    return apiClient<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  logout() {
    return apiClient<{ message: string }>('/auth/logout', {
      method: 'POST',
    });
  },

  getMe() {
    return apiClient<{ data: { id: number; username: string; email: string; full_name: string; role: string; created_at: string } }>('/auth/me');
  },

  checkReset(username: string) {
    return apiClient<ResetStatusResponse>('/auth/check-reset', {
      method: 'POST',
      body: JSON.stringify({ username }),
    });
  },
};
