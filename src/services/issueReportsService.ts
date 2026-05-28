import { IssueReportsListResponse, IssueReportSingleResponse } from '../types/issueReports';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const getIssueReports = async (): Promise<IssueReportsListResponse> => {
    const response = await fetch(`${API_BASE_URL}/issue-reports`);
    if (!response.ok) {
        throw new Error(`Failed to fetch issue reports: ${response.statusText}`);
    }
    return response.json();
};

export const createIssueReport = async (data: {
    title: string;
    description: string;
    reporter_name: string;
    reporter_email: string;
    severity: string;
}): Promise<IssueReportSingleResponse> => {
    const response = await fetch(`${API_BASE_URL}/issue-reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `Failed to create issue report: ${response.statusText}`);
    }
    return response.json();
};

export const updateIssueReportStatus = async (id: number, status: string): Promise<IssueReportSingleResponse> => {
    const response = await fetch(`${API_BASE_URL}/issue-reports/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `Failed to update issue report: ${response.statusText}`);
    }
    return response.json();
};
