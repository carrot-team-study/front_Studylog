export type TodoResponse = {
    todoId: number;
    subjectId: number;
    memberId: number;
    content: string;
    targetDate: string;   // "2026-02-12"
    isCompleted: boolean; // 여기 중요
    createdAt: string;
    updatedAt: string;
};