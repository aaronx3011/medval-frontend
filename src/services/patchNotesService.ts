import { PatchNotesListResponse } from '../types/patchNotes';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const getAllPatchNotes = async (): Promise<PatchNotesListResponse> => {
    const response = await fetch(`${API_BASE_URL}/patch-notes`);
    if (!response.ok) {
        throw new Error(`Failed to fetch patch notes: ${response.statusText}`);
    }
    return response.json();
};
