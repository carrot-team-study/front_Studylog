// src/domain/community/pages/MyGroupListPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { commApi } from "../api/commApi";
import type { Page, MyGroupListDto } from "../types/CommGroupType";

export default function MyGroupListPage() {
    const navigate = useNavigate();

    const [pageData, setPageData] = useState<Page<MyGroupListDto> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [page, setPage] = useState(0);
    const [size] = useState(20);

    const fetchMyGroups = async (nextPage = 0) => {
        setLoading(true);
        setError(null);

        try {
            // ✅ getData -> commApi
            const result = await commApi.my.groups(nextPage, size);

            setPageData(result);
            setPage(nextPage);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "불러오기 실패");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchMyGroups(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const goDetail = (groupId: number) => navigate(`/groups/${groupId}`);

    if (loading && !pageData) return <div style={{ padding: 16 }}>불러오는 중...</div>;
    if (error) return <div style={{ padding: 16, color: "red" }}>에러: {error}</div>;

    const items = pageData?.content ?? [];

    return (
        <div style={{ padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3>내가 가입한 그룹</h3>
                <button onClick={() => navigate("/groups/new")}>그룹 만들기</button>
            </div>

            {items.length === 0 ? (
                <div style={{ marginTop: 12, opacity: 0.8 }}>가입한 그룹이 없음</div>
            ) : (
                <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
                    {items.map((g) => (
                        <div
                            key={g.groupId}
                            onClick={() => goDetail(g.groupId)}
                            style={{
                                border: "1px solid #ddd",
                                borderRadius: 12,
                                padding: 12,
                                cursor: "pointer",
                            }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                                <div style={{ fontWeight: 700 }}>{g.groupName}</div>
                                <div style={{ fontSize: 12, opacity: 0.8 }}>{g.role}</div>
                            </div>

                            {g.groupIntro ? (
                                <div style={{ marginTop: 6, fontSize: 13, opacity: 0.9, whiteSpace: "pre-wrap" }}>
                                    {g.groupIntro}
                                </div>
                            ) : (
                                <div style={{ marginTop: 6, fontSize: 13, opacity: 0.6 }}>소개 없음</div>
                            )}

                            <div style={{ marginTop: 8, fontSize: 13, opacity: 0.85 }}>
                                멤버 {g.memberCount}/{g.maxUser} · 생성 {new Date(g.createdAt).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {pageData && pageData.totalPages > 1 && (
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 16 }}>
                    <button disabled={pageData.first || loading} onClick={() => void fetchMyGroups(page - 1)}>
                        이전
                    </button>
                    <span>
            {pageData.number + 1} / {pageData.totalPages} (총 {pageData.totalElements})
          </span>
                    <button disabled={pageData.last || loading} onClick={() => void fetchMyGroups(page + 1)}>
                        다음
                    </button>
                </div>
            )}
        </div>
    );
}
