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

    if (!todos.length) return <p className="text-muted text-center mt-3">작성된 Todo가 없습니다</p>;

    return (
        <ul className="list-unstyled mt-3">

            {todos.map((t) => (

                <li key={t.id} className="card mb-3 shadow-sm">
                    <div className="card-body d-flex justify-content-between align-items-center">

                        <div className="d-flex align-items-center">
                            <span className="badge bg-secondary me-2">
                                {t.subjectName}
                            </span>
                            <span className={t.completed ? "text-decoration-line-through text-muted" : ""}>
                                {t.content}
                            </span>
                        </div>

                        <div className="btn-group">
                            <button className="btn btn-sm btn-outline-primary" onClick={() => onEdit(t)}>
                                수정
                            </button>

                            <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(t.id)}>
                                삭제
                            </button>

                            <button className="btn btn-sm btn-outline-success" onClick={() => onToggle(t.id, !t.completed)}>
                                {t.completed ? "취소" : "완료"}
                            </button>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default TodoList;
