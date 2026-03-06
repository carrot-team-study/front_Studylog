// src/domain/todo/components/TodoForm.tsx

import React from "react";
import type { Subject } from "../../subject/types/subject";

interface TodoFormProps {
    content: string;
    subjectId: number | null;
    targetDate: string;
    subjects: Subject[];
    onContentChange: (value: string) => void;
    onSubjectChange: (value: number | null) => void;
    onDateChange: (value: string) => void;
    onSubmit: () => void;
    disabled?: boolean;
    mode: "create" | "edit";
}

const TodoForm: React.FC<TodoFormProps> = ({content, subjectId, subjects, onContentChange, onSubjectChange, onSubmit, disabled = false, mode,}) => {

    return (
        <div className="card shadow-sm mt-3">
            <div className="card-body">

                {/* 과목 선택 */}
                <div className="mb-3">
                    <label className="form-label" style={{ fontSize: "1.1rem" }}>과목</label>

                    <select
                        className="form-select"
                        style={{ maxWidth: "15rem" }}
                        value={subjectId ?? ""}
                        onChange={(e) =>
                            onSubjectChange(
                                e.target.value ? Number(e.target.value) : null
                            )
                        }>
                        <option value="">과목 선택</option>

                        {subjects.map((s) => (
                            <option key={s.subjectId} value={s.subjectId}>
                                {s.subjectName}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 내용 입력 */}
                <div className="mb-3">
                    <label className="form-label" style={{ fontSize: "1.1rem" }}>내용</label>

                    <input
                        type="text"
                        className="form-control"
                        value={content}
                        onChange={(e) => onContentChange(e.target.value)}
                        disabled={disabled}
                        placeholder="할 일을 입력하세요"/>
                </div>

                <button
                    className="btn btn-outline-secondary w-100"
                    onClick={onSubmit}
                    disabled={disabled}>
                    {mode === "create" ? "추가" : "수정"}
                </button>

            </div>
        </div>
    );
};

export default TodoForm;
