// src/domain/subject/api/subjectApi.ts
import { tokenStorage } from '../../member/api/memberApi';
import type {Subject, SubjectCreateRequest, SubjectUpdateRequest} from "../types/subject.ts";

const BASE_URL = '/api/subjects';

export const subjectApi = {
    getAll: async (): Promise<Subject[]> => {
        const token = tokenStorage.getAccessToken();
        const response = await fetch(BASE_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error('과목 조회 실패');
        return response.json();
    },

    create: async (data: SubjectCreateRequest): Promise<Subject> => {
        const token = tokenStorage.getAccessToken();
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || '과목 생성 실패');
        }
        return response.json();
    },

    update: async (id: number, data: SubjectUpdateRequest): Promise<Subject> => {
        const token = tokenStorage.getAccessToken();
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('과목 수정 실패');
        return response.json();
    },

    delete: async (id: number): Promise<void> => {
        const token = tokenStorage.getAccessToken();
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // 2xx 응답이면 성공
        if (response.status < 200 || response.status >= 300) {
            throw new Error('과목 삭제 실패');
        }
    },
};