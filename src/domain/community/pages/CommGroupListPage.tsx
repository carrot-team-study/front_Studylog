import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { commApi } from "../api/commApi";
import type { Page, GroupListDto, CommGroupSort } from "../types/CommGroupType";
import type { CommTagDto } from "../types/CommTagType";
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

    const [tags, setTags] = useState<CommTagDto[]>([]);
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

    const normalizedTags = useMemo(
        () =>
            tags
                .map((t) => ({
                    tagId: t.tagId,
                    tagName: (t.tagName ?? "").toString(),
                }))
                .filter((t) => t.tagName.trim().length > 0),
        [tags]
    );

    useEffect(() => {
        (async () => {
            try {
                const list = await commApi.tag.list();
                setTags(list);
            } catch {
                setTags([]);
            }
        })();
    }, []);

    const fetchGroups = async (nextPage = 0) => {
        setLoading(true);
        setError(null);
        try {
            const result = await commApi.group.list({
                keyword: keyword.trim() || undefined,
                order,
                page: nextPage,
                size,
                tagIds: selectedTagIds.length ? selectedTagIds : undefined,
            });

            setPageData(result);
            setPage(nextPage);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "알 수 없는 오류 발생");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchGroups(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSearch = () => void fetchGroups(0);

    const toggleTag = (tagId: number) => {
        setSelectedTagIds((prev) =>
            prev.includes(tagId) ? prev.filter((x) => x !== tagId) : [...prev, tagId]
        );
    };

    useEffect(() => {
        void fetchGroups(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order, selectedTagIds]);

    const clearTags = () => setSelectedTagIds([]);

    const goDetail = (groupId: number) => {
        navigate(`/groups/${groupId}`);
    };

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
                <div style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <div style={{ fontSize: 13, opacity: 0.8 }}>태그 필터</div>
                        <button onClick={clearTags} disabled={selectedTagIds.length === 0}>
                            태그 초기화
                        </button>
                    </div>

                    {normalizedTags.length === 0 ? (
                        <div style={{ opacity: 0.6 }}>태그 없음</div>
                    ) : (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                            {normalizedTags.map((t) => {
                                const active = selectedTagIds.includes(t.tagId);
                                return (
                                    <button
                                        key={t.tagId}
                                        onClick={() => toggleTag(t.tagId)}
                                        style={{
                                            padding: "6px 10px",
                                            borderRadius: 999,
                                            border: "1px solid #ddd",
                                            background: active ? "#111" : "#fff",
                                            color: active ? "#fff" : "#111",
                                            fontSize: 13,
                                            cursor: "pointer",
                                        }}
                                    >
                                        #{t.tagName}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="search-bar">
                    <input
                        className="search-input"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="키워드 검색"
                        onKeyDown={(e) => e.key === "Enter" && onSearch()}
                    />
                    <select
                        className="sort-select"
                        value={order}
                        onChange={(e) => setOrder(e.target.value as CommGroupSort)}
                    >
                        <option value="NEW">최신순</option>
                        <option value="OLD">오래된순</option>
                        <option value="GOAL_DESC">목표량순</option>
                        <option value="MEMBERS_DESC">인원많은순</option>
                    </select>
                    <button className="search-btn" onClick={onSearch} disabled={loading}>
                        검색
                    </button>
                </div>

                {loading && pageData && <p className="loading-inline">로딩 중...</p>}

                {items.length === 0 ? (
                    <div className="empty-state">그룹이 없습니다.</div>
                ) : (
                    <div className="group-list">
                        {items.map((g) => (
                            <button
                                key={g.groupId}
                                className="group-card"
                                onClick={() => goDetail(g.groupId)}
                            >
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
                        <button
                            className="page-btn"
                            disabled={pageData.first || loading}
                            onClick={() => void fetchGroups(page - 1)}
                        >
                            이전
                        </button>
                        <span className="page-info">
                            {pageData.number + 1} / {pageData.totalPages} (총 {pageData.totalElements})
                        </span>
                        <button
                            className="page-btn"
                            disabled={pageData.last || loading}
                            onClick={() => void fetchGroups(page + 1)}
                        >
                            다음
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CommGroupListPage;