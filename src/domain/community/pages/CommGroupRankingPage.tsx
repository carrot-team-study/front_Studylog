import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { commApi } from "../api/commApi";
import type { RankRowDto } from "../types/CommGroupType";
import "../css/CommGroupRankingPage.css";

type Tab = "likes" | "todos";

export default function CommGroupRankingPage() {
    const { groupId } = useParams<{ groupId: string }>();
    const navigate = useNavigate();

    const gid = useMemo(() => {
        const n = Number(groupId);
        return Number.isFinite(n) ? n : null;
    }, [groupId]);

    const [tab, setTab] = useState<Tab>("likes");
    const [date, setDate] = useState<string>("");
    const [limit, setLimit] = useState(20);

    const [rows, setRows] = useState<RankRowDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRanking = async () => {
        if (gid == null) return;

        setLoading(true);
        setError(null);

        try {
            const params = {
                limit,
                ...(tab === "todos" && date.trim() ? { date: date.trim() } : {}),
            };

            const data =
                tab === "likes"
                    ? await commApi.ranking.likes(gid, params)
                    : await commApi.ranking.todos(gid, params);

            setRows(data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "랭킹 불러오기 실패");
            setRows([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchRanking();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gid, tab, date, limit]);

    if (gid == null) {
        return <div className="comm-ranking-fallback">잘못된 groupId</div>;
    }

    return (
        <div className="comm-ranking-container">
            <header className="page-header">
                <button className="back-btn" onClick={() => navigate(-1)}>←</button>
                <h2>그룹 랭킹</h2>
                <div style={{ width: 40 }} />
            </header>

            <div className="comm-ranking-body">
                <section className="ranking-top-card">
                    <div className="ranking-title-row">
                        <div>
                            <h3 className="ranking-title">멤버 랭킹</h3>
                            <p className="ranking-subtitle">
                                그룹 멤버들의 좋아요 / 완료 투두 순위를 확인할 수 있어요.
                            </p>
                        </div>
                    </div>

                    <div className="ranking-filter-row">
                        <div className="tab-group">
                            <button
                                className={`tab-btn ${tab === "likes" ? "active" : ""}`}
                                onClick={() => setTab("likes")}
                                disabled={tab === "likes"}
                            >
                                좋아요 랭킹
                            </button>
                            <button
                                className={`tab-btn ${tab === "todos" ? "active" : ""}`}
                                onClick={() => setTab("todos")}
                                disabled={tab === "todos"}
                            >
                                완료 투두 랭킹
                            </button>
                        </div>

                        <select
                            className="limit-select"
                            value={limit}
                            onChange={(e) => setLimit(Number(e.target.value))}
                        >
                            {[10, 20, 30, 50].map((n) => (
                                <option key={n} value={n}>
                                    TOP {n}
                                </option>
                            ))}
                        </select>
                    </div>

                    {tab === "todos" && (
                        <div className="date-filter-row">
                            <span className="date-label">날짜 선택</span>
                            <input
                                className="date-input"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                            <button className="date-reset-btn" onClick={() => setDate("")}>
                                오늘 기준
                            </button>
                        </div>
                    )}
                </section>

                <section className="ranking-list-card">
                    {loading ? (
                        <div className="empty-state">불러오는 중...</div>
                    ) : error ? (
                        <div className="error-state">{error}</div>
                    ) : rows.length === 0 ? (
                        <div className="empty-state">데이터 없음</div>
                    ) : (
                        <div className="ranking-list">
                            {rows.map((r, idx) => (
                                <article key={r.memberId} className="ranking-item">
                                    <div className="ranking-left">
                                        <div
                                            className={`rank-badge ${
                                                idx === 0
                                                    ? "gold"
                                                    : idx === 1
                                                        ? "silver"
                                                        : idx === 2
                                                            ? "bronze"
                                                            : ""
                                            }`}
                                        >
                                            {idx + 1}
                                        </div>

                                        <div>
                                            <div className="member-name">{r.nickname}</div>
                                            <div className="member-rank-text">
                                                {idx === 0
                                                    ? "현재 1위"
                                                    : `${idx + 1}위 멤버`}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="ranking-score">
                                        {tab === "likes"
                                            ? `좋아요 ${r.score}`
                                            : `완료 ${r.score}`}
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