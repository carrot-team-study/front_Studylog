// src/domain/statistics/api/statisticsApi.ts
import { tokenStorage } from '../../member/api/memberApi';
import type {Stat} from "../types/statistics.ts";

const BASE_URL = '/api/statistics';

export const statisticsApi = {
    // 특정 날짜 과목별 통계
    getDailyStats: async (date: string): Promise<Stat> => {
        const token = tokenStorage.getAccessToken();
        const response = await fetch(`${BASE_URL}/daily?date=${date}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error('일간 통계 조회 실패');
        return response.json();
    },

    // 주간 통계
    getWeekly: async (weekStart: string): Promise<Stat> => {
        const token = tokenStorage.getAccessToken();
        const response = await fetch(`${BASE_URL}/weekly?weekStart=${weekStart}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error('주간 통계 조회 실패');
        return response.json();
    },

    // 월간 통계
    getMonthly: async (month: string): Promise<Stat> => {
        const token = tokenStorage.getAccessToken();
        const response = await fetch(`${BASE_URL}/monthly?month=${month}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error('월간 통계 조회 실패');
        return response.json();
    },

    // 오늘 총 학습시간
    getTodayTotal: async (): Promise<number> => {
        const token = tokenStorage.getAccessToken();
        const response = await fetch(`${BASE_URL}/today/total`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error('오늘 학습시간 조회 실패');
        return response.json();
    },

    // 오늘 통계 (총합 + 과목별)
    getTodayStats: async (): Promise<Stat> => {
        const token = tokenStorage.getAccessToken();
        const response = await fetch(`${BASE_URL}/today`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error('오늘 통계 조회 실패');
        return response.json();
    },
};