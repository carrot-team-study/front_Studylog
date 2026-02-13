// src/domain/plan/types/plan.ts
export interface Plan {
    planId: number;
    title: string;
    content: string;
    targetDate: string;
    startTime: string;
    endTime: string;
    memberId: number;
}

export interface PlanCreateRequest {
    title: string;
    content: string;
    targetDate: string;
    startTime: string;
    endTime: string;
}

export interface PlanUpdateRequest {
    title: string;
    content: string;
    targetDate: string;
    startTime: string;
    endTime: string;
}