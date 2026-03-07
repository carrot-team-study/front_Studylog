import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { commApi } from "../api/commApi";
import type { Page, MyGroupListDto } from "../types/CommGroupType";
import "../css/MyGroupListPage.css";

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

    if (loading && !pageData) {
        return (
            <div className="my-group-container">
                <header className="page-header">
                    <button className="back-btn" onClick={() => navigate(-1)}>←</button>
                    <h2>내 그룹</h2>
                    <div style={{ width: 40 }} />
                </header>
                <div className="my-group-body">
                    <div className="empty-state">불러오는 중...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="my-group-container">
                <header className="page-header">
                    <button className="back-btn" onClick={() => navigate(-1)}>←</button>
                    <h2>내 그룹</h2>
                    <div style={{ width: 40 }} />
                </header>
                <div className="my-group-body">
                    <div className="error-state">에러: {error}</div>
                </div>
            </div>
        );
    }

    const items = pageData?.content ?? [];

    return (
        <div className="my-group-container">
            <header className="page-header">
                <button className="back-btn" onClick={() => navigate(-1)}>←</button>
                <h2>내 그룹</h2>
                <div style={{ width: 40 }} />
            </header>

            <div className="my-group-body">
                <section className="my-group-top-card">
                    <div className="my-group-title-row">
                        <div>
                            <h3 className="my-group-title">내가 가입한 그룹</h3>
                            <p className="my-group-subtitle">
                                가입 중인 그룹 목록을 확인하고 상세 페이지로 이동할 수 있어요.
                            </p>
                        </div>

                        <button
                            className="create-btn"
                            onClick={() => navigate("/groups/new")}
                        >
                            + 그룹 만들기
                        </button>
                    </div>
                </section>

                <section className="my-group-list-card">
                    {items.length === 0 ? (
                        <div className="empty-state">가입한 그룹이 없음</div>
                    ) : (
                        <div className="my-group-list">
                            {items.map((g) => (
                                <article
                                    key={g.groupId}
                                    className="my-group-item"
                                    onClick={() => goDetail(g.groupId)}
                                >
                                    <div className="my-group-item-top">
                                        <div className="my-group-name">{g.groupName}</div>
                                        <div className="my-group-role">{g.role}</div>
                                    </div>

                                    {g.groupIntro ? (
                                        <div className="my-group-intro">{g.groupIntro}</div>
                                    ) : (
                                        <div className="my-group-intro empty">소개 없음</div>
                                    )}

                                    <div className="my-group-meta">
                                        멤버 {g.memberCount}/{g.maxUser} · 생성{" "}
                                        {new Date(g.createdAt).toLocaleString()}
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}

                    {pageData && pageData.totalPages > 1 && (
                        <div className="pagination">
                            <button
                                className="page-btn"
                                disabled={pageData.first || loading}
                                onClick={() => void fetchMyGroups(page - 1)}
                            >
                                이전
                            </button>
                            <span className="page-info">
                                {pageData.number + 1} / {pageData.totalPages} (총 {pageData.totalElements})
                            </span>
                            <button
                                className="page-btn"
                                disabled={pageData.last || loading}
                                onClick={() => void fetchMyGroups(page + 1)}
                            >
                                다음
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}