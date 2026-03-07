import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { commApi } from "../api/commApi";
import type { TodoResponse } from "../types/TodoType";
import type { MeResponse } from "../types/CommGroupType";
import "../css/GroupMemberTodoPage.css";

function formatYmd(d: Date) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}

export default function GroupMemberTodoPage() {
    const { groupId, memberId } = useParams<{ groupId: string; memberId: string }>();
    const navigate = useNavigate();

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
            if (seq === reqSeq.current) {
                setTodos(list);
            }
        } catch (e: unknown) {
            if (seq === reqSeq.current) {
                setError(e instanceof Error ? e.message : "불러오기 실패");
                setTodos([]);
            }
        } finally {
            if (seq === reqSeq.current) {
                setLoading(false);
            }
        }
        const list = await commApi.member.todos(gid, mid, d);
        console.log("member todos response =", list);
        if (seq === reqSeq.current) {
            setTodos(list);
        }
    };

    useEffect(() => {
        if (gid == null || mid == null) return;
        void loadTodos(date);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gid, mid, date]);

    if (gid == null || mid == null) {
        return <div className="member-todo-fallback">잘못된 파라미터</div>;
    }

    return (
        <div className="member-todo-container">
            <header className="page-header">
                <button className="back-btn" onClick={() => navigate(-1)}>←</button>
                <h2>멤버 투두</h2>
                <div style={{ width: 40 }} />
            </header>

            <div className="member-todo-body">
                <section className="todo-top-card">
                    <div className="todo-title-row">
                        <div>
                            <h3 className="todo-title">
                                투두 {date === todayYmd ? "(Today)" : `(${date})`}
                            </h3>
                            <p className="todo-subtitle">
                                {isMine ? "내 투두입니다." : "다른 멤버의 투두입니다. 읽기 전용으로 볼 수 있어요."}
                            </p>
                        </div>

                        <span className={`todo-status-badge ${isMine ? "mine" : "readonly"}`}>
                            {isMine ? "내 투두" : "읽기 전용"}
                        </span>
                    </div>

                    <div className="todo-filter-row">
                        <input
                            className="date-input"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                        <button className="today-btn" onClick={() => setDate(todayYmd)}>
                            오늘
                        </button>

                        <div className="todo-filter-spacer" />

                        {isMine && (
                            <button
                                className="my-todo-btn"
                                onClick={() => navigate("/todos", { state: { selectedDate: date } })}
                            >
                                내 투두보기
                            </button>
                        )}
                    </div>
                </section>

                <section className="todo-list-card">
                    {loading ? (
                        <div className="empty-state">불러오는 중...</div>
                    ) : error ? (
                        <div className="error-state">에러: {error}</div>
                    ) : todos.length === 0 ? (
                        <div className="empty-state">투두 없음</div>
                    ) : (
                        <div className="todo-list">
                            {todos.map((t) => (
                                <article key={t.todoId} className="todo-item">
                                    <div className="todo-item-left">
                                        <div className={`todo-check ${t.completed ? "done" : ""}`}>
                                            {t.completed ? "✅" : "⬜️"}
                                        </div>

                                        <div className="todo-text-area">
                                            <div className={`todo-content ${t.completed ? "done" : ""}`}>
                                                {t.content}
                                            </div>
                                            <div className="todo-date">{t.targetDate}</div>
                                        </div>
                                    </div>

                                    <div className={`todo-complete-badge ${t.completed? "done" : "pending"}`}>
                                        {t.completed ? "완료" : "미완료"}
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}