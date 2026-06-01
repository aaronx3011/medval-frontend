import { apiClient } from './apiClient';
import type { PatchNotesListResponse } from '../types/patchNotes';

export const getAllPatchNotes = async (): Promise<PatchNotesListResponse> => {
    return apiClient('/patch-notes');
};
