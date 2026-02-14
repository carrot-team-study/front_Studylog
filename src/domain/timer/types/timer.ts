// src/domain/timer/types/timer.ts

export interface TimerStatus {
    subjectId: number;
    running: boolean;
    elapsed: number; // 초 단위
}

export interface TimerStopResponse {
    duration: number; // 초 단위
}

export interface TimerRecord {
    timerId: number;
    subjectId: number;
    subjectName: string;
    duration: number;
    startTime: string;
    endTime: string;
    timerDate?: string;
}

export interface StudyLogSummary {
    totalDuration: number;
}