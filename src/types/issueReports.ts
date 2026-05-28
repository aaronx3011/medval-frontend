export interface IssueReport {
    id: number;
    title: string;
    description: string;
    reporter_name: string;
    reporter_email: string;
    severity: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface IssueReportsListResponse {
    data: IssueReport[];
}

export interface IssueReportSingleResponse {
    data: IssueReport;
}
