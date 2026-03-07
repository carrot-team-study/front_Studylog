// src/domain/community/pages/CommGroupRankingPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { commApi } from "../api/commApi";
import type { RankRowDto } from "../types/CommGroupType";

type Tab = "likes" | "todos";

export default function CommGroupRankingPage() {
    const { groupId } = useParams<{ groupId: string }>();
    const navigate = useNavigate();

    const gid = useMemo(() => {
        const n = Number(groupId);
        return Number.isFinite(n) ? n : null;
    }, [groupId]);

    const [tab, setTab] = useState<Tab>("likes");
    const [date, setDate] = useState<string>(""); // todos용(선택)
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

            // ✅ getData(url) -> commApi.ranking.*
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

    if (gid == null) return <div style={{ padding: 16 }}>잘못된 groupId</div>;

    return (
        <div style={{ padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3>그룹 랭킹</h3>
                <button onClick={() => navigate(-1)}>뒤로</button>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <button onClick={() => setTab("likes")} disabled={tab === "likes"}>
                    좋아요 랭킹
                </button>
                <button onClick={() => setTab("todos")} disabled={tab === "todos"}>
                    완료 투두 랭킹
                </button>

                <select value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
                    {[10, 20, 30, 50].map((n) => (
                        <option key={n} value={n}>
                            TOP {n}
                        </option>
                    ))}
                </select>
            </div>

            {tab === "todos" && (
                <div style={{ marginTop: 10, display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 13, opacity: 0.8 }}>날짜(선택)</span>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    <button onClick={() => setDate("")}>오늘</button>
                </div>
            )}

            <div style={{ marginTop: 14 }}>
                {loading ? (
                    <div>불러오는 중...</div>
                ) : error ? (
                    <div style={{ color: "red" }}>{error}</div>
                ) : rows.length === 0 ? (
                    <div style={{ opacity: 0.8 }}>데이터 없음</div>
                ) : (
                    <div style={{ display: "grid", gap: 8 }}>
                        {rows.map((r, idx) => (
                            <div
                                key={r.memberId}
                                style={{
                                    border: "1px solid #ddd",
                                    borderRadius: 12,
                                    padding: 12,
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                                    <div style={{ width: 28, fontWeight: 800 }}>{idx + 1}</div>
                                    <div style={{ fontWeight: 700 }}>{r.nickname}</div>
                                </div>

                                <div style={{ fontSize: 14 }}>
                                    {tab === "likes" ? `좋아요 ${r.score}` : `완료 ${r.score}`}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
