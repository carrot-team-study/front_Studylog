// src/domain/todo/components/TodoList.tsx

import React from "react";
import type { Todo } from "../types/todo";

interface Props {
    todos: Todo[];
    onEdit: (todo: Todo) => void;
    onDelete: (id: number) => void;
    onToggle: (id: number, completed: boolean) => void;
}

const TodoList: React.FC<Props> = ({ todos, onEdit, onDelete, onToggle }) => {
    if (!todos.length) return <p>작성된 Todo가 없습니다.</p>;

    return (
        <ul style={{ listStyle: "none", padding: 0 }}>
            {todos.map((t) => (
                <li
                    key={t.id}
                    style={{
                        marginBottom: "10px",
                        padding: "10px",
                        borderRadius: "10px",
                        backgroundColor: "#fafafa",
                    }}>
                    <strong
                        style={{
                            textDecoration: t.completed ? "line-through" : "none",
                        }}>
                        [{t.subjectName}] {t.content}
                    </strong>

                    <div style={{ marginTop: "6px" }}>
                        <button onClick={() => onEdit(t)}>수정</button>
                        <button onClick={() => onDelete(t.id)}>삭제</button>
                        <button onClick={() => onToggle(t.id, !t.completed)}>
                            {t.completed ? "취소" : "완료"}
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default TodoList;