import { apiClient } from './apiClient';
import type { IssueReportsListResponse, IssueReportSingleResponse } from '../types/issueReports';

export const getIssueReports = async (): Promise<IssueReportsListResponse> => {
    return apiClient('/issue-reports');
};

export const createIssueReport = async (data: {
    title: string;
    description: string;
    reporter_name: string;
    reporter_email: string;
    severity: string;
}): Promise<IssueReportSingleResponse> => {
    return apiClient('/issue-reports', {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

export const updateIssueReportStatus = async (id: number, status: string): Promise<IssueReportSingleResponse> => {
    return apiClient(`/issue-reports/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
    });
};
