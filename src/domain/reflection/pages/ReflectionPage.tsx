// src/domain/reflection/pages/ReflectionPage.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReflectionForm from "../components/ReflectionForm";
import { createReflection, getReflections, updateReflection, deleteReflection } from "../api/reflectionApi";
import type { Reflection } from "../types/reflection";

function ReflectionPage() {
    // 상태 관리
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [reflections, setReflections] = useState<Reflection[]>([]);
    const [selectedReflection, setSelectedReflection] = useState<Reflection | null>(null);
    const [mode, setMode] = useState<"create" | "edit">("create");
    const navigate = useNavigate();

    // 날짜 포맷 함수
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const handleBack = () => {
        if (mode === "edit") {
            const confirmed = confirm("작성 중인 내용이 사라질 수 있습니다. 이동할까요?");
            if (!confirmed) return;
        }
        navigate(-1);
    };

    const fetchReflections = async () => {
        try {
            const data = await getReflections();
            setReflections(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => { fetchReflections(); }, []);

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

    const handleDelete = async (reflectionId: number) => {
        if (!confirm("정말 삭제할까요?")) return;
        try {
            await deleteReflection(reflectionId);
            setReflections((prev) => prev.filter((r) => r.id !== reflectionId));
            alert("회고 삭제 완료");
            if (selectedReflection?.id === reflectionId) {
                setSelectedReflection(null);
                setContent("");
                setMode("create");
            }
        } catch (e) {
            console.error("삭제 실패 로그:", e);
        }
    };

    const handleSelectReflection = (reflection: Reflection) => {
        setSelectedReflection(reflection);
        setContent(reflection.content);
        setMode("edit");
    };

    // 수정 취소 버튼 클릭 시 실행
    const handleCancel = () => {
        setContent("");
        setSelectedReflection(null);
        setMode("create");
    };

    return (
        <div className="reflection-container">

            <header className="page-header d-flex justify-content-between align-items-center">
                <button className="back-btn btn btn-light" onClick={handleBack}>←</button>
                <h2 className="m-0">회고</h2>
                <div style={{ width: 40 }} />
            </header>

            <div className="reflection-body mx-auto px-3 pt-4" style={{ maxWidth: "40rem" }}>

                <div className="card shadow-sm mb-3">
                    <div className="card-body">
                        <h4 className="mb-3 fw-bold">
                            {mode === "create" ? "오늘의 회고 작성" : "회고 수정"}
                        </h4>

                        <ReflectionForm
                            content={content}
                            onChange={setContent}
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                            disabled={loading}
                            mode={mode}/>
                    </div>
                </div>

                {reflections.length === 0 ? (
                    <div className="empty-state text-center text-muted py-5">작성된 회고가 없습니다</div>
                ) : (
                    <div className="reflection-list d-flex flex-column gap-3">
                        {reflections.map((r) => (
                            <div key={r.id} className="reflection-item card shadow-sm">
                                <div className="card-body">
                                    <p className="reflection-content mb-2" style={{ fontSize:"0.9rem" }}>{r.content}</p>
                                    <div className="reflection-meta d-flex justify-content-between align-items-center">
                                        <span className="reflection-date text-muted" style={{ fontSize:"0.8rem" }}>
                                            {formatDate(r.createdAt)}
                                        </span>

                                        <div className="reflection-item-actions d-flex gap-2">
                                            <button
                                                className="edit-btn btn btn-sm btn-light"
                                                onClick={() => handleSelectReflection(r)}>
                                                수정
                                            </button>
                                            <button
                                                className="delete-btn btn btn-sm btn-danger"
                                                onClick={() => handleDelete(r.id)}>
                                                삭제
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ReflectionPage;
