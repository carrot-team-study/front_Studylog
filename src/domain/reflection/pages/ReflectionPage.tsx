import { useEffect, useState } from "react";
import ReflectionForm from "../components/ReflectionForm";
import { createReflection, getReflections, updateReflection, deleteReflection, } from "../api/reflectionApi";
import type { Reflection } from "../types/reflection";
import {useNavigate} from "react-router-dom";

function ReflectionPage() {
    // 입력 내용
    const [content, setContent] = useState("");
    // 서버 통신 여부
    const [loading, setLoading] = useState(false);
    // 회고 목록
    const [reflections, setReflections] = useState<Reflection[]>([]);
    // 선택된 회고
    const [selectedReflection, setSelectedReflection] =
        useState<Reflection | null>(null);
    // 작성 / 수정 모드
    const [mode, setMode] = useState<"create" | "edit">("create");
    // 페이지 이동
    const navigate = useNavigate();

    /**
     * 뒤로가기 버튼 클릭 시 실행
     * - 브라우저 히스토리 기준으로 이전 페이지로 이동
     * - 메인 → 회고, 다른 페이지 → 회고 등 어떤 경로든 자연스럽게 동작
     */
    const handleBack = () => {
        // 수정 중일 경우 실수 방지용 확인
        if (mode === "edit") {
            const confirmed = confirm(
                "작성 중인 내용이 사라질 수 있습니다. 이동할까요?"
            );
            if (!confirmed) return;
        }

        navigate(-1);
    };

    /**
     * 회고 목록 조회
     */
    const fetchReflections = async () => {
        try {
            const data = await getReflections();
            setReflections(data);
        } catch (error) {
            console.error(error);
            // API에서 alert 처리
        }
    };

    useEffect(() => {
        fetchReflections();
    }, []);

    /**
     * 회고 저장 / 수정
     */
    const handleSubmit = async () => {
        if (!content.trim()) return;

        try {
            setLoading(true);

            if (mode === "create") {
                await createReflection(content);
                alert("회고 저장 완료");
            } else {
                await updateReflection(selectedReflection!.id, content);
                alert("회고 수정 완료");
            }

            // 초기화
            setContent("");
            setSelectedReflection(null);
            setMode("create");

            await fetchReflections();
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    /**
     * 회고 삭제
     */
    /**
     * 회고 삭제
     */
    const handleDelete = async (reflectionId: number) => {
        const confirmed = confirm("정말 삭제할까요?");
        if (!confirmed) return;

        try {
            // 1. 서버에 삭제 요청 (인터셉터에서 성공 시 다음 줄 실행)
            await deleteReflection(reflectionId);

            // 2. 서버 요청 성공 후, 프론트엔드 상태(reflections)에서 즉시 제거
            setReflections((prev) => prev.filter((r) => r.id !== reflectionId));

            alert("회고 삭제 완료");

            // 3. 수정 중이던 회고 삭제 시 초기화 로직 유지
            if (selectedReflection?.id === reflectionId) {
                setSelectedReflection(null);
                setContent("");
                setMode("create");
            }

            // 굳이 fetchReflections()를 호출하지 않아도 2번 과정에서 화면이 바뀝니다.
            // 만약 서버와 데이터 불일치가 걱정된다면 추가해도 되지만, 2번이 훨씬 빠릅니다.
        } catch (e) {
            console.error("삭제 실패 로그:", e);
            // 에러 alert은 인터셉터(api/index.ts)에서 이미 띄워졌을 겁니다.
        }
    };

    /**
     * 회고 선택 (수정 모드)
     */
    const handleSelectReflection = (reflection: Reflection) => {
        setSelectedReflection(reflection);
        setContent(reflection.content);
        setMode("edit");
    };

    return (
        <div>
            {/* 상단 헤더 영역 */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {/* 뒤로가기 버튼 */}
                <button onClick={handleBack}>
                    ← 뒤로가기
                </button>

                <h1>Reflection</h1>
            </div>

            {/* 회고 작성 / 수정 폼 */}
            <ReflectionForm
                content={content}
                onChange={setContent}
                onSubmit={handleSubmit}
                disabled={loading}
                mode={mode}
            />

            {/* 회고 목록 */}
            <ul>
                {reflections.map((r) => (
                    <li key={r.id} style={{ marginBottom: "8px" }}>
                        <div>
                            <strong>{r.content}</strong>
                            <small> ({r.createdAt})</small>
                        </div>

                        <button onClick={() => handleSelectReflection(r)}>
                            수정
                        </button>
                        <button onClick={() => handleDelete(r.id)}>
                            삭제
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ReflectionPage;
