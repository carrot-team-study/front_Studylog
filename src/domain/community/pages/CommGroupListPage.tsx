// domain/community/pages/CommGroupListPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getData } from "../../../global/api/http";
import type { Page, GroupListDto, CommGroupSort } from "../types/CommGroupType";

function CommGroupListPage() {
    const navigate = useNavigate();

    const [pageData, setPageData] = useState<Page<GroupListDto> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [keyword, setKeyword] = useState("");
    const [order, setOrder] = useState<CommGroupSort>("NEW");
    const [page, setPage] = useState(0);
    const [size] = useState(20);

    const fetchGroups = async (nextPage = 0) => {
        setLoading(true);
        setError(null);

        try {
            const result = await getData<Page<GroupListDto>>("/api/comm", {
                params: {
                    keyword: keyword.trim() || undefined,
                    order,
                    page: nextPage,
                    size,
                    // tagIds: [1,2] // 필요하면 추가
                },
            });

            setPageData(result); // ✅ 이제 Page 자체
            setPage(nextPage);
        } catch (e) {
            setError(e instanceof Error ? e.message : "알 수 없는 오류 발생");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroups(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSearch = () => fetchGroups(0);

    const goDetail = (groupId: number) => {
        navigate(`/groups/${groupId}`);
    };

    if (loading && !pageData) {
        return <div style={{ padding: "2.5rem", textAlign: "center" }}>그룹 불러오는 중</div>;
    }

    if (error) {
        return (
            <div style={{ padding: "2.5rem", color: "#f00", textAlign: "center" }}>
                불러오기 실패: {error}
            </div>
        );
    }

    const items = pageData?.content ?? [];

    return (
        <div style={{ padding: "1.5rem" }}>
            <h3>그룹 리스트</h3>
            <button onClick={() => navigate("/groups/new")}>그룹 만들기</button>
            <button onClick={() => navigate("/my/groups")}>내 그룹</button>
            <div style={{ display: "flex", gap: 8, margin: "12px 0" }}>
                <input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="키워드 검색"
                    style={{ flex: 1 }}
                />
                <select value={order} onChange={(e) => setOrder(e.target.value as CommGroupSort)}>
                    <option value="NEW">최신순</option>
                    <option value="OLD">오래된순</option>
                    <option value="GOAL_DESC">목표량순</option>
                    <option value="MEMBERS_DESC">인원많은순</option>
                </select>
                <button onClick={onSearch} disabled={loading}>
                    검색
                </button>
            </div>

            {loading && pageData ? <div style={{ marginBottom: 8 }}>로딩중...</div> : null}

            {items.length === 0 ? (
                <div style={{ padding: "2rem 0" }}>그룹이 없음</div>
            ) : (
                <div style={{ display: "grid", gap: 10 }}>
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
                            <div style={{ fontWeight: 700 }}>{g.groupName}</div>
                            <div style={{ marginTop: 6, fontSize: 14, opacity: 0.9 }}>
                                멤버 {g.memberCount} · 생성 {new Date(g.createdAt).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {pageData && pageData.totalPages > 0 && (
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 16 }}>
                    <button disabled={pageData.first || loading} onClick={() => fetchGroups(page - 1)}>
                        이전
                    </button>
                    <span>
            {pageData.number + 1} / {pageData.totalPages} (총 {pageData.totalElements})
          </span>
                    <button disabled={pageData.last || loading} onClick={() => fetchGroups(page + 1)}>
                        다음
                    </button>
                </div>
            )}
        </div>
    );
}

export default CommGroupListPage;
