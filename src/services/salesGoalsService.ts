import { apiClient } from './apiClient';
import type { SalesGoalListResponse, SalesGoalSingleResponse } from '../types/salesGoals';

export const getAllSalesGoals = async (): Promise<SalesGoalListResponse> => {
    return apiClient('/sales-goals');
};

export const getSalesGoalById = async (id: number): Promise<SalesGoalSingleResponse> => {
    return apiClient(`/sales-goals/${id}`);
};

export const createSalesGoal = async (year: number, month: number, goal_amount: number): Promise<SalesGoalSingleResponse> => {
    return apiClient('/sales-goals', {
        method: 'POST',
        body: JSON.stringify({ year, month, goal_amount }),
    });
};

export const updateSalesGoal = async (id: number, goal_amount: number): Promise<SalesGoalSingleResponse> => {
    return apiClient(`/sales-goals/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ goal_amount }),
    });
};
