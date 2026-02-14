// src/domain/todo/api/todoApi.ts

import api from "../../../global/api";
import type { Todo } from "../types/todo";

export const getTodos = async (): Promise<Todo[]> => {
    const data = await api.get<any[]>("/todos");
    return data.map((t) => ({
        id: t.todoId,
        subjectId: t.subjectId,
        subjectName: t.subjectName,
        content: t.content,
        targetDate: t.targetDate,
        completed: t.completed,
    }));
};

export const getTodosByDate = async (date: string): Promise<Todo[]> => {
    const data = await api.get<any[]>("/todos/date", { params: { date } });
    return data.map((t) => ({
        id: t.todoId,
        subjectId: t.subjectId,
        subjectName: t.subjectName,
        content: t.content,
        targetDate: t.targetDate,
        completed: t.completed,
    }));
};

export const createTodo = async (payload: { content: string; subjectId: number; targetDate: string }) => {
    await api.post("/todos", payload);
};

export const updateTodo = async (
    todoId: number,
    payload: { content: string; subjectId: number; targetDate: string }
) => {
    await api.put(`/todos/${todoId}`, payload);
};

export const deleteTodo = async (todoId: number) => {
    await api.delete(`/todos/${todoId}`);
};

export const updateTodoComplete = async (todoId: number, completed: boolean) => {
    await api.patch(`/todos/${todoId}/complete`, null, { params: { completed } });
};
