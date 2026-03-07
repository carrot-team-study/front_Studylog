export type TodoResponse = {
    todoId: number;
    subjectId: number;
    memberId: number;
    content: string;
    targetDate: string;   // "2026-02-12"
    completed: boolean;
    createdAt: string;
    updatedAt: string;
};