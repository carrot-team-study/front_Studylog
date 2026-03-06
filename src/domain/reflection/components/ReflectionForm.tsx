// src/domain/reflection/components/ReflectionForm.tsx

import { useRef, useEffect } from "react";

/**
 * 컴포넌트의 Props 타입을 정의
 */
type Props = {
    // 내용 값
    content: string;
    // 글자 변경 시 실행
    onChange: (value: string) => void;
    // 저장 버튼 클릭 시 실행
    onSubmit: () => void;
    // 취소 버튼 클릭 시 실행
    onCancel?: () => void;
    // 버튼 활성화 여부 (기본 : false)
    disabled?: boolean;
    // 작성 / 수정 모드
    mode: "create" | "edit";
};

export default function ReflectionForm({content, onChange, onSubmit, onCancel, disabled = false, mode,}: Props) {

    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    // content 변경 시 textarea 높이 자동 조정
    useEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
    }, [content]);

    return (
        <div>
            {/* 텍스트 입력 영역 */}
            <textarea
                ref={textareaRef}
                className="form-control mb-3 fw-light fs-6"
                value={content}
                onChange={(e) => onChange(e.target.value)}
                rows={4} // 입력창 높이
                placeholder="오늘의 회고를 작성하세요"
                style={{ resize: "none", overflow: "hidden" }}/>

            {/* 저장 버튼 */}
            <div className="d-flex justify-content-end gap-2">
                <button
                    className="btn text-white"
                    style={{backgroundColor:"#5c9edc"}}
                    onClick={onSubmit}
                    disabled={disabled}>
                    {mode === "create" ? "저장" : "수정"}
                </button>

                {/* 수정 모드일 때 취소 버튼 표시 */}
                {mode === "edit" && (
                    <button
                        className="btn text-white"
                        style={{background: "#dc3545"}}
                        onClick={onCancel}>
                        취소
                    </button>
                )}
            </div>

        </div>
    );
}
