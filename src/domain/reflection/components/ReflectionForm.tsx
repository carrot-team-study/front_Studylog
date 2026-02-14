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
    // 버튼 활성화 여부 (기본 : false)
    disabled?: boolean;
    // 작성 / 수정 모드
    mode: "create" | "edit";
};

export default function ReflectionForm({content, onChange, onSubmit, disabled = false, mode,}: Props) {
    return (
        <div>
            {/* 텍스트 입력 영역 */}
            <textarea
                value={content} // 부모로부터 받은 state 값이 입력창에 보여진다
                onChange={(e) => onChange(e.target.value)} // 사용자가 입력할 때마다 onChange 실행
                rows={5} // 입력창 높이
                placeholder="오늘의 회고를 작성하세요"
            />

            {/* 저장 버튼 */}
            {/* disabled가 true면 버튼이 비활성화 (중복 클릭 방지 등) */}
            <button
                onClick={onSubmit}
                disabled={disabled}>
                {mode === "create" ? "저장" : "수정"}
            </button>
        </div>
    );
}
