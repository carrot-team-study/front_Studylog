import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReflectionForm from "../components/ReflectionForm";
import { createReflection, getReflections, updateReflection, deleteReflection } from "../api/reflectionApi";
import type { Reflection } from "../types/reflection";
import "../css/ReflectionPage.css";

function ReflectionPage() {
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [reflections, setReflections] = useState<Reflection[]>([]);
    const [selectedReflection, setSelectedReflection] = useState<Reflection | null>(null);
    const [mode, setMode] = useState<"create" | "edit">("create");
    const navigate = useNavigate();

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

    return (
        <div className="reflection-container">
            <header className="page-header">
                <button className="back-btn" onClick={handleBack}>←</button>
                <h2>회고</h2>
                <div style={{ width: 40 }} />
            </header>

            <div className="reflection-body">
                <div className="reflection-form-card">
                    <h3>{mode === "create" ? "오늘의 회고 작성" : "회고 수정"}</h3>
                    <ReflectionForm
                        content={content}
                        onChange={setContent}
                        onSubmit={handleSubmit}
                        disabled={loading}
                        mode={mode}
                    />
                </div>

                {reflections.length === 0 ? (
                    <div className="empty-state">작성된 회고가 없습니다.</div>
                ) : (
                    <div className="reflection-list">
                        {reflections.map((r) => (
                            <div key={r.id} className="reflection-item">
                                <p className="reflection-content">{r.content}</p>
                                <div className="reflection-meta">
                                    <span className="reflection-date">{r.createdAt}</span>
                                    <div className="reflection-item-actions">
                                        <button className="edit-btn" onClick={() => handleSelectReflection(r)}>수정</button>
                                        <button className="delete-btn" onClick={() => handleDelete(r.id)}>삭제</button>
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