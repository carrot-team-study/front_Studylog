// src/domain/statistics/types/statistics.ts
export interface StatSubject {
    subjectName: string;
    totalStudyTime: number;
    ratio: number;
}

export interface Stat {
    periodType: 'DAILY' | 'WEEKLY' | 'MONTHLY';
    startDate: string;
    totalStudyTime: number;
    subjects: StatSubject[];
    dailyStats?: Stat[];
}