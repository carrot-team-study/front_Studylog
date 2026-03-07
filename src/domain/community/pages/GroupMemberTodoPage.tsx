// src/domain/community/pages/GroupMemberTodoPage.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // ✅ useNavigate 추가
import { commApi } from "../api/commApi";
import type { TodoResponse } from "../types/TodoType";
import type { MeResponse } from "../types/CommGroupType";

function formatYmd(d: Date) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}

export default function GroupMemberTodoPage() {
    const { groupId, memberId } = useParams<{ groupId: string; memberId: string }>();
    const navigate = useNavigate(); // ✅

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

    const reqSeq = useRef(0);

    useEffect(() => {
        (async () => {
            try {
                const me = await commApi.me();
                setMyId((me as MeResponse).memberId);
            } catch {
                setMyId(null);
            }
        })();
    }, []);

    const loadTodos = async (d: string) => {
        if (gid == null || mid == null) return;

        const seq = ++reqSeq.current;
        setLoading(true);
        setError(null);

        try {
            const list = await commApi.member.todos(gid, mid, d);
            if (seq === reqSeq.current) setTodos(list);
        } catch (e: unknown) {
            if (seq === reqSeq.current) {
                setError(e instanceof Error ? e.message : "불러오기 실패");
                setTodos([]);
            }
        } finally {
            if (seq === reqSeq.current) setLoading(false);
        }
    };

    useEffect(() => {
        if (gid == null || mid == null) return;
        void loadTodos(date);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gid, mid, date]);

    // ✅ 이제 커뮤니티에서 완료 토글은 제거 (백엔드가 없으니까)
    // => 체크박스 자체를 안 보여주거나, 비활성화 처리

    if (gid == null || mid == null) return <div style={{ padding: 16 }}>잘못된 파라미터</div>;

    return (
        <div style={{ padding: 16 }}>
            <h2 style={{ marginBottom: 8 }}>투두 ({date === todayYmd ? "Today" : date})</h2>

            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                <button onClick={() => setDate(todayYmd)}>오늘</button>

                <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
                    {/* ✅ 내 투두일 때만 "내 투두보기" 버튼 */}
                    {isMine && (
                        <button
                            onClick={() => {
                                // ✅ TodoPage로 이동 + 현재 date도 같이 넘김
                                // 라우트가 /todos 면 "/todos"로 바꿔
                                navigate("/todos", { state: { selectedDate: date } });
                            }}
                        >
                            내 투두보기
                        </button>
                    )}
                    <span style={{ fontSize: 13, opacity: 0.8 }}>{isMine ? "내 투두" : "읽기 전용"}</span>
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
                                <div style={{ fontWeight: 700 }}>{(t.isCompleted ? "✅ " : "⬜️ ") + t.content}</div>
                                <div style={{ marginTop: 6, fontSize: 12, opacity: 0.7 }}>{t.targetDate}</div>
                            </div>

                            {/* ✅ 체크박스 제거: 커뮤니티 완료 API가 없으니 */}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
