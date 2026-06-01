import { apiClient } from './apiClient';
import type { User } from '../types/auth';

export const userService = {
  getAll() {
    return apiClient<{ data: User[] }>('/users');
  },
};
