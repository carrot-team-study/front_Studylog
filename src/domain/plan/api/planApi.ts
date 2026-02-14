// src/domain/plan/api/planApi.ts
import {tokenStorage} from '../../member/api/memberApi';
import type {Plan, PlanCreateRequest, PlanUpdateRequest} from "../types/plan.ts";

const BASE_URL = '/api/plans';

export const planApi = {
    // 날짜별 계획 조회
    getByDate: async (date: string): Promise<Plan[]> => {
        const token = tokenStorage.getAccessToken();
        const response = await fetch(`${BASE_URL}?date=${date}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error('계획 조회 실패');
        return response.json();
    },

    // 계획 생성
    create: async (data: PlanCreateRequest): Promise<Plan> => {
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
            throw new Error(error || '계획 생성 실패');
        }
        return response.json();
    },

    // 계획 수정
    update: async (id: number, data: PlanUpdateRequest): Promise<Plan> => {
        const token = tokenStorage.getAccessToken();
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('계획 수정 실패');
        return response.json();
    },

    // 계획 삭제
    delete: async (id: number): Promise<void> => {
        const token = tokenStorage.getAccessToken();
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status < 200 || response.status >= 300) {
            throw new Error('계획 삭제 실패');
        }
    },
};