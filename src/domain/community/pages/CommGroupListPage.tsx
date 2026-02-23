// domain/community/pages/CommGroupListPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getData } from "../../../global/api/http";
import type { Page, GroupListDto, CommGroupSort } from "../types/CommGroupType";
import "../css/CommGroupListPage.css";

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
                params: { keyword: keyword.trim() || undefined, order, page: nextPage, size },
            });
            setPageData(result);
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

    if (loading && !pageData) {
        return (
            <div className="comm-container">
                <header className="page-header">
                    <button className="back-btn" onClick={() => navigate(-1)}>←</button>
                    <h2>커뮤니티</h2>
                    <div style={{ width: 40 }} />
                </header>
                <div className="empty-state">불러오는 중...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="comm-container">
                <header className="page-header">
                    <button className="back-btn" onClick={() => navigate(-1)}>←</button>
                    <h2>커뮤니티</h2>
                    <div style={{ width: 40 }} />
                </header>
                <div className="error-state">불러오기 실패: {error}</div>
            </div>
        );
    }

    const items = pageData?.content ?? [];

    return (
        <div className="comm-container">
            <header className="page-header">
                <button className="back-btn" onClick={() => navigate(-1)}>←</button>
                <h2>커뮤니티</h2>
                <div className="header-actions">
                    <button className="my-groups-btn" onClick={() => navigate("/my/groups")}>내 그룹</button>
                    <button className="create-btn" onClick={() => navigate("/groups/new")}>+ 그룹 만들기</button>
                </div>
            </header>

            <div className="comm-body">
                <div className="search-bar">
                    <input
                        className="search-input"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="키워드 검색"
                        onKeyDown={(e) => e.key === "Enter" && fetchGroups(0)}
                    />
                    <select className="sort-select" value={order} onChange={(e) => setOrder(e.target.value as CommGroupSort)}>
                        <option value="NEW">최신순</option>
                        <option value="OLD">오래된순</option>
                        <option value="GOAL_DESC">목표량순</option>
                        <option value="MEMBERS_DESC">인원많은순</option>
                    </select>
                    <button className="search-btn" onClick={() => fetchGroups(0)} disabled={loading}>검색</button>
                </div>

                {loading && pageData && <p className="loading-inline">로딩 중...</p>}

                {items.length === 0 ? (
                    <div className="empty-state">그룹이 없습니다.</div>
                ) : (
                    <div className="group-list">
                        {items.map((g) => (
                            <button key={g.groupId} className="group-card" onClick={() => navigate(`/groups/${g.groupId}`)}>
                                <p className="group-name">{g.groupName}</p>
                                <p className="group-meta">
                                    멤버 {g.memberCount} · {new Date(g.createdAt).toLocaleDateString()}
                                </p>
                            </button>
                        ))}
                    </div>
                )}

                {pageData && pageData.totalPages > 0 && (
                    <div className="pagination">
                        <button className="page-btn" disabled={pageData.first || loading} onClick={() => fetchGroups(page - 1)}>이전</button>
                        <span className="page-info">{pageData.number + 1} / {pageData.totalPages} (총 {pageData.totalElements})</span>
                        <button className="page-btn" disabled={pageData.last || loading} onClick={() => fetchGroups(page + 1)}>다음</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CommGroupListPage;