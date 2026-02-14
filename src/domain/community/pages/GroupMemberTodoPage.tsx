// domain/community/pages/GroupMemberTodoPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getData, patchData } from "../../../global/api/http";
import type { TodoResponse } from "../types/TodoType";
import type { MeResponse } from "../types/CommGroupType"; // 너 프로젝트 타입 경로에 맞춰

function formatYmd(d: Date) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}

export default function GroupMemberTodoPage() {
    const { groupId, memberId } = useParams<{ groupId: string; memberId: string }>();

    const gid = useMemo(() => {
        const n = Number(groupId);
        return Number.isFinite(n) ? n : null;
    }, [groupId]);

    const mid = useMemo(() => {
        const n = Number(memberId);
        return Number.isFinite(n) ? n : null;
    }, [memberId]);

    const [myId, setMyId] = useState<number | null>(null);

    const [date, setDate] = useState<string>(() => formatYmd(new Date()));
    const [todos, setTodos] = useState<TodoResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const todayYmd = useMemo(() => formatYmd(new Date()), []);
    const isMine = useMemo(() => myId != null && mid != null && myId === mid, [myId, mid]);

    // ✅ 내 ID 로드 (/api/me)
    useEffect(() => {
        (async () => {
            try {
                const me = await getData<MeResponse>("/api/me");
                setMyId(me.memberId);
            } catch {
                setMyId(null);
            }
        })();
    }, []);

    const loadTodos = async (d: string) => {
        if (gid == null || mid == null) return;

        setLoading(true);
        setError(null);

        try {
            const list = await getData<TodoResponse[]>(
                `/api/comm/${gid}/members/${mid}/todos`,
                { params: { date: d } }
            );
            setTodos(list);
        } catch (e) {
            setError(e instanceof Error ? e.message : "불러오기 실패");
            setTodos([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (gid == null || mid == null) return;
        loadTodos(date);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gid, mid, date]);

    // ✅ 완료/취소 토글 (내 투두만)
    const toggleComplete = async (todoId: number, nextCompleted: boolean) => {
        if (!isMine) return;

        // 1) UI 먼저 반영(낙관적 업데이트)
        setTodos((prev) =>
            prev.map((t) => (t.todoId === todoId ? { ...t, isCompleted: nextCompleted } : t))
        );

        try {
            await patchData<void>(`/todos/${todoId}/complete`, undefined, {
                params: { completed: nextCompleted },
            });

            // 2) 서버값으로 동기화
            await loadTodos(date);
        } catch (e) {
            // 실패하면 롤백
            setTodos((prev) =>
                prev.map((t) => (t.todoId === todoId ? { ...t, isCompleted: !nextCompleted } : t))
            );
            alert(e instanceof Error ? e.message : "완료 상태 변경 실패");
        }
    };

    if (gid == null || mid == null) return <div style={{ padding: 16 }}>잘못된 파라미터</div>;

    return (
        <div style={{ padding: 16 }}>
            <h2 style={{ marginBottom: 8 }}>투두 ({date === todayYmd ? "Today" : date})</h2>

            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                <button onClick={() => setDate(todayYmd)}>오늘</button>

                <div style={{ marginLeft: "auto", fontSize: 13, opacity: 0.8 }}>
                    {isMine ? "내 투두: 완료/취소 가능" : "읽기 전용"}
                </div>
            </div>

            {loading ? (
                <div>불러오는 중...</div>
            ) : error ? (
                <div style={{ color: "red" }}>에러: {error}</div>
            ) : todos.length === 0 ? (
                <div>투두 없음</div>
            ) : (
                <div style={{ display: "grid", gap: 10 }}>
                    {todos.map((t) => (
                        <div
                            key={t.todoId}
                            style={{
                                border: "1px solid #ddd",
                                borderRadius: 12,
                                padding: 12,
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: 12,
                            }}
                        >
                            <div>
                                <div style={{ fontWeight: 700 }}>
                                    {(t.isCompleted ? "✅ " : "⬜️ ") + t.content}
                                </div>
                                <div style={{ marginTop: 6, fontSize: 12, opacity: 0.7 }}>{t.targetDate}</div>
                            </div>

                            {isMine && (
                                <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                    <input
                                        type="checkbox"
                                        checked={t.isCompleted}
                                        onChange={(e) => toggleComplete(t.todoId, e.target.checked)}
                                    />
                                    <span style={{ fontSize: 13 }}>{t.isCompleted ? "완료" : "미완료"}</span>
                                </label>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
