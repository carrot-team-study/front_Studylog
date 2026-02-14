// src/domain/todo/components/TodoForm.tsx

/**
 * ⚠️ TODO: 과목 select 하드코딩 제거 필요
 *
 * 현재 과목 옵션을 아래처럼 하드코딩하고 있음:
 *
 *   <option value={1}>수학</option>
 *   <option value={2}>영어</option>
 *   <option value={3}>과학</option>
 *
 * ❗ 문제점
 * - DB의 subjectId와 프론트에서 가정한 id가 다를 수 있음
 * - 실제 subject 테이블 id 순서가 바뀌면 잘못 저장됨
 * - 과목이 추가/삭제되면 프론트 코드 수정 필요
 *
 * ✅ 추후 개선 방향
 * 1. Subject API (/api/subjects) 추가
 * 2. TodoPage에서 subjects 목록 fetch
 * 3. subjects를 TodoForm에 props로 전달
 * 4. select를 subjects.map() 방식으로 렌더링
 *
 * 예시:
 *
 * {subjects.map((subject) => (
 *   <option key={subject.id} value={subject.id}>
 *     {subject.name}
 *   </option>
 * ))}
 *
 * 🎯 목표:
 * - 하드코딩 제거
 * - DB 기준 subjectId 사용
 * - 과목 동적 확장 가능 구조로 변경
 */

import React from "react";

interface TodoFormProps {
    content: string;
    subjectId: number | null;
    targetDate: string;
    onContentChange: (value: string) => void;
    onSubjectChange: (value: number | null) => void;
    onDateChange: (value: string) => void;
    onSubmit: () => void;
    disabled?: boolean;
    mode: "create" | "edit";
}

const TodoForm: React.FC<TodoFormProps> = ({content, subjectId, targetDate, onContentChange, onSubjectChange, onDateChange, onSubmit, disabled = false, mode,}) => {
    return (
        <div style={{ marginBottom: "16px", border: "1px solid #ccc", padding: "8px", borderRadius: "4px" }}>
            <div style={{ marginBottom: "8px" }}>
                <label>
                    과목:
                    <select
                        value={subjectId ?? ""}
                        onChange={(e) => onSubjectChange(e.target.value ? Number(e.target.value) : null)}
                        disabled={disabled}>
                        <option value="">선택</option>
                        <option value={1}>수학</option>
                        <option value={2}>영어</option>
                        <option value={3}>과학</option>
                        {/* 필요한 과목 옵션 추가 */}
                    </select>
                </label>
            </div>

            <div style={{ marginBottom: "8px" }}>
                <label>
                    내용:
                    <input
                        type="text"
                        value={content}
                        onChange={(e) => onContentChange(e.target.value)}
                        disabled={disabled}
                        placeholder="할 일을 입력하세요"
                        style={{ width: "100%" }}/>
                </label>
            </div>

            <div style={{ marginBottom: "8px" }}>
                <label>
                    수행일:
                    <input
                        type="date"
                        value={targetDate}
                        onChange={(e) => onDateChange(e.target.value)}
                        disabled={disabled}/>
                </label>
            </div>

            <button onClick={onSubmit} disabled={disabled}>
                {mode === "create" ? "추가" : "수정"}
            </button>
        </div>
    );
};

export default TodoForm;
