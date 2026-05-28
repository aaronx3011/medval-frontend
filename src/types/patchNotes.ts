export interface PatchNote {
    id: number;
    title: string;
    content: string;
    version: string;
    category: string;
    published_at: string;
    created_at: string;
}

export interface PatchNotesListResponse {
    data: PatchNote[];
}
