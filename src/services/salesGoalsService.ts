import { SalesGoalListResponse, SalesGoalSingleResponse } from '../types/salesGoals';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const getAllSalesGoals = async (): Promise<SalesGoalListResponse> => {
    const response = await fetch(`${API_BASE_URL}/sales-goals`);
    if (!response.ok) {
        throw new Error(`Failed to fetch sales goals: ${response.statusText}`);
    }
    return response.json();
};

export const getSalesGoalById = async (id: number): Promise<SalesGoalSingleResponse> => {
    const response = await fetch(`${API_BASE_URL}/sales-goals/${id}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch sales goal: ${response.statusText}`);
    }
    return response.json();
};

export const createSalesGoal = async (year: number, month: number, goal_amount: number): Promise<SalesGoalSingleResponse> => {
    const response = await fetch(`${API_BASE_URL}/sales-goals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year, month, goal_amount }),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `Failed to create sales goal: ${response.statusText}`);
    }
    return response.json();
};

export const updateSalesGoal = async (id: number, goal_amount: number): Promise<SalesGoalSingleResponse> => {
    const response = await fetch(`${API_BASE_URL}/sales-goals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal_amount }),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `Failed to update sales goal: ${response.statusText}`);
    }
    return response.json();
};
