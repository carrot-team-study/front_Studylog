// src/domain/todo/types/todo.ts

export interface Todo {
    id: number; // todoId
    subjectId: number; // 과목 번호
    subjectName: string; // 과목명
    content: string; // 내용
    targetDate: string; // 수행일 (yyyy-mm-dd)
    completed: boolean; // 완료 여부
}
