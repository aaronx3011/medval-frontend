export interface SalesGoal {
    id: number;
    year: number;
    month: number;
    goal_amount: number;
    created_at: string;
    updated_at: string;
}

export interface SalesGoalListResponse {
    data: SalesGoal[];
}

export interface SalesGoalSingleResponse {
    data: SalesGoal;
}
