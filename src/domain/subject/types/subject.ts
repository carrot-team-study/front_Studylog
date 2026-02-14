// src/domain/subject/types/subject.ts
export interface Subject {
    subjectId: number;
    memberId: number;
    subjectName: string;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
}

export interface SubjectCreateRequest {
    subjectName: string;
}

export interface SubjectUpdateRequest {
    subjectName: string;
}