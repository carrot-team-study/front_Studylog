import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { commApi } from "../api/commApi";
import type {
    CommGroupDetailResponse,
    GroupMemberLikeDto,
    GroupJoinRequest,
} from "../types/CommGroupType";
import type { CommTagDto } from "../types/CommTagType";
import "../css/CommGroupDetailPage.css";

type ApiErrorShape = {
    code?: string;
    message?: string;
    status?: number;
    response?: { status?: number };
};

function getStatus(err: unknown): number | undefined {
    if (err && typeof err === "object") {
        const e = err as ApiErrorShape;
        return e.status ?? e.response?.status;
    }
    return undefined;
}

function getErrorMessage(err: unknown, fallback = "알 수 없는 오류"): string {
    if (err instanceof Error) return err.message;
    if (err && typeof err === "object") {
        const e = err as ApiErrorShape;
        if (typeof e.message === "string" && e.message.trim()) return e.message;
    }
    return fallback;
}

function getErrorCode(err: unknown): string | undefined {
    if (err && typeof err === "object") {
        const e = err as ApiErrorShape;
        if (typeof e.code === "string") return e.code;
    }
    return undefined;
}

export default function CommGroupDetailPage() {
    const { groupId } = useParams<{ groupId: string }>();
    const navigate = useNavigate();

    const gid = useMemo(() => {
        const n = Number(groupId);
        return Number.isFinite(n) ? n : null;
    }, [groupId]);

    const [detail, setDetail] = useState<CommGroupDetailResponse | null>(null);
    const [members, setMembers] = useState<GroupMemberLikeDto[]>([]);
    const [isJoined, setIsJoined] = useState(false);
    const [myId, setMyId] = useState<number | null>(null);

    const [loading, setLoading] = useState(true);
    const [memberLoading, setMemberLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [memberError, setMemberError] = useState<string | null>(null);

    const [allTags, setAllTags] = useState<CommTagDto[]>([]);

    useEffect(() => {
        (async () => {
            try {
                const list = await commApi.tag.list();
                setAllTags(list);
            } catch {
                setAllTags([]);
            }
        })();
    }, []);

    const tagNameById = useMemo(() => {
        const map = new Map<number, string>();
        for (const t of allTags) {
            const name = t.tagName;
            if (typeof name === "string" && name.trim()) {
                map.set(t.tagId, name);
            }
        }
        return map;
    }, [allTags]);

    useEffect(() => {
        (async () => {
            try {
                const me = await commApi.me();
                setMyId(me.memberId);
            } catch {
                setMyId(null);
            }
        })();
    }, []);

    useEffect(() => {
        if (gid == null) return;

        (async () => {
            setLoading(true);
            setError(null);
            try {
                const d = await commApi.group.detail(gid);
                setDetail(d);
            } catch (err: unknown) {
                setError(getErrorMessage(err, "알 수 없는 오류"));
            } finally {
                setLoading(false);
            }
        })();
    }, [gid]);

    useEffect(() => {
        if (gid == null) return;

        (async () => {
            try {
                const list = await commApi.member.list(gid, { silent: true });
                setMembers(list);

                if (myId != null) {
                    setIsJoined(list.some((m) => m.memberId === myId));
                } else {
                    setIsJoined(false);
                }

                setMemberError(null);
            } catch (err: unknown) {
                const status = getStatus(err);

                if (status === 403) {
                    setIsJoined(false);
                    setMembers([]);
                    setMemberError(null);
                    return;
                }

                setIsJoined(false);
                setMembers([]);
                setMemberError(getErrorMessage(err, "가입 여부 확인 실패"));
            }
        })();
    }, [gid, myId]);

    const loadMembers = async () => {
        if (gid == null) return;

        setMemberLoading(true);
        setMemberError(null);

        try {
            const list = await commApi.member.list(gid, { silent: true });
            setMembers(list);

            if (myId != null) {
                setIsJoined(list.some((m) => m.memberId === myId));
            } else {
                setIsJoined(false);
            }
        } catch (err: unknown) {
            const status = getStatus(err);

            if (status === 403) {
                setIsJoined(false);
                setMembers([]);
                setMemberError(null);
                return;
            }

            setIsJoined(false);
            setMembers([]);
            setMemberError(getErrorMessage(err, "멤버 불러오기 실패"));
        } finally {
            setMemberLoading(false);
        }
    };

    const onJoin = async () => {
        if (gid == null) return;

        try {
            await commApi.group.join(gid);
            await loadMembers();
            return;
        } catch (err: unknown) {
            const code = getErrorCode(err);
            const msg = getErrorMessage(err, "");
            const needPassword =
                code === "GROUP_PASSWORD_REQUIRED" || msg.includes("비밀번호");

            if (!needPassword) {
                alert(msg || "가입 실패");
                return;
            }
        }

        const password = window.prompt("비밀번호 입력")?.trim();
        if (!password) return;

        try {
            const body: GroupJoinRequest = { password };
            await commApi.group.join(gid, body);
            await loadMembers();
        } catch (err: unknown) {
            const code = getErrorCode(err);
            if (code === "GROUP_PASSWORD_MISMATCH") {
                alert("비밀번호가 틀림");
                return;
            }
            alert(getErrorMessage(err, "가입 실패"));
        }
    };

    const onLeave = async () => {
        if (gid == null) return;
        if (!window.confirm("정말 탈퇴할래?")) return;

        try {
            await commApi.group.leave(gid);
            setIsJoined(false);
            setMembers([]);
            setMemberError(null);
        } catch (err: unknown) {
            alert(getErrorMessage(err, "탈퇴 실패"));
        }
    };

    const onToggleLike = async (toUserId: number) => {
        if (gid == null) return;
        if (!isJoined) {
            alert("가입해야 좋아요 가능");
            return;
        }

        try {
            await commApi.member.toggleLike(gid, toUserId);
            await loadMembers();
        } catch (err: unknown) {
            alert(getErrorMessage(err, "좋아요 실패"));
        }
    };

    const goMemberTodos = (memberId: number) => {
        if (!isJoined) {
            alert("가입해야 멤버 투두를 볼 수 있음");
            return;
        }
        navigate(`/groups/${gid}/members/${memberId}/todos`);
    };

    if (gid == null) {
        return <div className="comm-detail-fallback">잘못된 groupId</div>;
    }

    if (loading) {
        return (
            <div className="comm-detail-container">
                <header className="page-header">
                    <button className="back-btn" onClick={() => navigate(-1)}>←</button>
                    <h2>그룹 상세</h2>
                    <div style={{ width: 40 }} />
                </header>
                <div className="comm-detail-body">
                    <div className="empty-state">불러오는 중...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="comm-detail-container">
                <header className="page-header">
                    <button className="back-btn" onClick={() => navigate(-1)}>←</button>
                    <h2>그룹 상세</h2>
                    <div style={{ width: 40 }} />
                </header>
                <div className="comm-detail-body">
                    <div className="error-state">불러오기 실패: {error}</div>
                </div>
            </div>
        );
    }

    if (!detail) {
        return (
            <div className="comm-detail-container">
                <header className="page-header">
                    <button className="back-btn" onClick={() => navigate(-1)}>←</button>
                    <h2>그룹 상세</h2>
                    <div style={{ width: 40 }} />
                </header>
                <div className="comm-detail-body">
                    <div className="empty-state">데이터 없음</div>
                </div>
            </div>
        );
    }

    const tagNames: Array<{ id: number; name: string }> =
        detail.tagIds?.map((id) => ({
            id,
            name: tagNameById.get(id) ?? `tag#${id}`,
        })) ?? [];

    return (
        <div className="comm-detail-container">
            <header className="page-header">
                <button className="back-btn" onClick={() => navigate(-1)}>←</button>
                <h2>그룹 상세</h2>
                <div style={{ width: 40 }} />
            </header>

            <div className="comm-detail-body">
                <section className="detail-card">
                    <div className="detail-top">
                        <div>
                            <h1 className="group-title">{detail.groupName}</h1>
                            <p className="group-subtitle">
                                함께 목표를 달성하는 커뮤니티 그룹
                            </p>
                        </div>

                        <div className="action-row">
                            {isJoined ? (
                                <button className="leave-btn" onClick={onLeave}>
                                    탈퇴하기
                                </button>
                            ) : (
                                <button className="join-btn" onClick={onJoin}>
                                    가입하기
                                </button>
                            )}

                            {isJoined && (
                                <button
                                    className="ranking-btn"
                                    onClick={() => navigate(`/groups/${gid}/rankings`)}
                                >
                                    랭킹 보기
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="info-grid">
                        {"maxUser" in detail && (
                            <div className="info-box">
                                <div className="info-label">정원</div>
                                <div className="info-value">
                                    {typeof detail.maxUser === "number" ? `${detail.maxUser}명` : "-"}
                                </div>
                            </div>
                        )}

                        {"leaderId" in detail && (
                            <div className="info-box">
                                <div className="info-label">리더 ID</div>
                                <div className="info-value">
                                    {typeof detail.leaderId === "number" ? detail.leaderId : "-"}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="section-block">
                        <div className="section-title">태그</div>
                        <div className="tag-list">
                            {tagNames.length === 0 ? (
                                <span className="tag-empty">태그 없음</span>
                            ) : (
                                tagNames.map((t) => (
                                    <span key={t.id} className="tag-chip">
                                        #{t.name}
                                    </span>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="section-block">
                        <div className="section-title">소개</div>
                        {detail.groupIntro ? (
                            <div className="intro-box">{detail.groupIntro}</div>
                        ) : (
                            <div className="intro-box intro-empty">소개가 없습니다.</div>
                        )}
                    </div>
                </section>

                <section className="member-section">
                    <div className="member-section-header">
                        <h3>멤버</h3>
                        {isJoined && members.length === 0 && !memberLoading && (
                            <button className="reload-btn" onClick={loadMembers}>
                                멤버 불러오기
                            </button>
                        )}
                    </div>

                    {!isJoined ? (
                        <div className="empty-state">
                            가입해야 멤버 목록, 투두, 좋아요를 사용할 수 있습니다.
                        </div>
                    ) : memberLoading ? (
                        <div className="loading-inline">멤버 불러오는 중...</div>
                    ) : memberError ? (
                        <div className="error-state">{memberError}</div>
                    ) : members.length === 0 ? (
                        <div className="empty-state">멤버가 없습니다.</div>
                    ) : (
                        <div className="member-list">
                            {members.map((m) => (
                                <article key={m.memberId} className="member-card">
                                    <div className="member-top">
                                        <div>
                                            <div className="member-name">{m.nickname}</div>
                                            <div className="member-like-text">
                                                좋아요 {m.likeCount}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="member-actions">
                                        <button
                                            className="member-todo-btn"
                                            onClick={() => goMemberTodos(m.memberId)}
                                        >
                                            투두 보기
                                        </button>
                                        <button
                                            className="member-like-btn"
                                            onClick={() => onToggleLike(m.memberId)}
                                        >
                                            {m.likedByMe ? "좋아요 취소" : "좋아요"}
                                        </button>
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