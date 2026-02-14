// src/domain/todo/api/todoApi.ts

import api from "../../../global/api";
import type { Todo } from "../types/todo";

/**
 * 모든 투두 조회
 */
export const getTodos = async (): Promise<Todo[]> => {
    // 제네릭 <any> 대신 <unknown> 사용 후 타입 단언
    const data = await api.get<unknown[]>("/todos");

    return (data as Array<Record<string, unknown>>).map((t) => ({
        id: t["todoId"] as number,
        subjectId: t["subjectId"] as number,
        subjectName: t["subjectName"] as string,
        content: t["content"] as string,
        targetDate: t["targetDate"] as string,
        completed: t["completed"] as boolean,
    }));
};

/**
 * 날짜별 투두 조회
 */
export const getTodosByDate = async (date: string): Promise<Todo[]> => {
    const data = await api.get<unknown[]>("/todos/date", { params: { date } });

    return (data as Array<Record<string, unknown>>).map((t) => ({
        id: t["todoId"] as number,
        subjectId: t["subjectId"] as number,
        subjectName: t["subjectName"] as string,
        content: t["content"] as string,
        targetDate: t["targetDate"] as string,
        completed: t["completed"] as boolean,
    }));
};

/**
 * 투두 생성
 */
export const createTodo = async (payload: { content: string; subjectId: number; targetDate: string }) => {
    await api.post("/todos", payload);
};

/**
 * 투두 수정
 */
export const updateTodo = async (
    todoId: number,
    payload: { content: string; subjectId: number; targetDate: string }
) => {
    await api.put(`/todos/${todoId}`, payload);
};

/**
 * 투두 삭제
 */
export const deleteTodo = async (todoId: number) => {
    await api.delete(`/todos/${todoId}`);
};

/**
 * 완료 상태 업데이트
 */
export const updateTodoComplete = async (todoId: number, completed: boolean) => {
    await api.patch(`/todos/${todoId}/complete`, null, { params: { completed } });
};