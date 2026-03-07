// src/domain/community/pages/CommGroupListPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { commApi } from "../api/commApi";
import type { Page, GroupListDto, CommGroupSort } from "../types/CommGroupType";
import type { CommTagDto } from "../types/CommTagType";

function CommGroupListPage() {
    const navigate = useNavigate();

    const [pageData, setPageData] = useState<Page<GroupListDto> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [keyword, setKeyword] = useState("");
    const [order, setOrder] = useState<CommGroupSort>("NEW");
    const [page, setPage] = useState(0);
    const [size] = useState(20);

    // ✅ 태그 목록 + 선택 태그
    const [tags, setTags] = useState<CommTagDto[]>([]);
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

    // 태그명 통일(서버가 tagName 또는 name 중 뭐로 주든 대응)
    const normalizedTags = useMemo(
        () =>
            tags
                .map((t) => ({
                    tagId: t.tagId,
                    tagName: (t.tagName ?? t.tagName ?? "").toString(),
                }))
                .filter((t) => t.tagName.trim().length > 0),
        [tags]
    );

    // ✅ 태그 목록 로드
    useEffect(() => {
        (async () => {
            try {
                const list = await commApi.tag.list(); // GET /api/comm/tags
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
                tagIds: selectedTagIds.length ? selectedTagIds : undefined, // ✅ 핵심
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

    // ✅ 태그 토글
    const toggleTag = (tagId: number) => {
        setSelectedTagIds((prev) => {
            const next = prev.includes(tagId) ? prev.filter((x) => x !== tagId) : [...prev, tagId];
            return next;
        });
    };

    // ✅ 태그/정렬/키워드 바뀌면 자동 검색하고 싶으면 이 useEffect 켜기
    useEffect(() => {
        // 초기 로딩 이후에도 계속 자동 호출되는 게 싫으면 주석 처리
        void fetchGroups(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order, selectedTagIds]);

    const clearTags = () => setSelectedTagIds([]);

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

            {/* ✅ 태그 필터 */}
            <div style={{ marginTop: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ fontSize: 13, opacity: 0.8 }}>태그 필터</div>
                    <button onClick={clearTags} disabled={selectedTagIds.length === 0}>
                        태그 초기화
                    </button>
                </div>

                {normalizedTags.length === 0 ? (
                    <div style={{ marginTop: 8, opacity: 0.6 }}>태그 없음</div>
                ) : (
                    <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 8 }}>
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

            {/* 검색/정렬 */}
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
                                멤버 {g.memberCount} · 생성 {new Date(g.createdAt).toLocaleDateString()}

                            </div>
                        </div>
                    ))}
                </div>
            )}

            {pageData && pageData.totalPages > 0 && (
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 16 }}>
                    <button disabled={pageData.first || loading} onClick={() => void fetchGroups(page - 1)}>
                        이전
                    </button>
                    <span>
            {pageData.number + 1} / {pageData.totalPages} (총 {pageData.totalElements})
          </span>
                    <button disabled={pageData.last || loading} onClick={() => void fetchGroups(page + 1)}>
                        다음
                    </button>
                </div>
            )}
        </div>
    );
}

export default CommGroupListPage;
