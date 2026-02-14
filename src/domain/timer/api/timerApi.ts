// src/domain/timer/api/timerApi.ts
import api from "../../../global/api";

import type {
    TimerStatus,
    TimerStopResponse,
    TimerRecord,
    StudyLogSummary
} from "../types/timer";

/**
 * 타이머 시작
 */
export const startTimer = async (subjectId: number) => {
    await api.post("/timer/start", null, {
        params: { subjectId }
    });
};

/**
 * 일시정지
 */
export const pauseTimer = async (subjectId: number) => {
    await api.post("/timer/pause", null, {
        params: { subjectId }
    });
};

/**
 * 재개
 */
export const resumeTimer = async (subjectId: number) => {
    await api.post("/timer/resume", null, {
        params: { subjectId }
    });
};

/**
 * 종료
 */
export const stopTimer = async (
    subjectId: number
): Promise<TimerStopResponse> => {
    return await api.post<TimerStopResponse>("/timer/stop", null, {
        params: { subjectId }
    });
};

/**
 * 상태 조회
 */
export const getTimerStatus = async (
    subjectId: number
): Promise<TimerStatus> => {
    return await api.get<TimerStatus>("/timer/status", {
        params: { subjectId }
    });
};

/**
 * 날짜별 기록 조회
 */
export const getTimerRecords = async (
    date: string
): Promise<TimerRecord[]> => {
    return await api.get<TimerRecord[]>("/timer/records", {
        params: { date }
    });
};

/**
 * 수동 기록 추가
 */
export const addManualTimer = async (data: { subjectId: number; duration: number }): Promise<TimerStopResponse> => {
    return await api.post<TimerStopResponse>("/timer/records/manual", data);
};

/**
 * 하루 총 학습 시간
 */
export const getDailySummary = async (
    date: string
): Promise<StudyLogSummary> => {
    return await api.get<StudyLogSummary>("/timer/records/summary", {
        params: { date }
    });
};