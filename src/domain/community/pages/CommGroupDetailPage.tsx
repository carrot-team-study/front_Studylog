// src/domain/community/pages/CommGroupDetailPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { commApi } from "../api/commApi";
import type {
    CommGroupDetailResponse,
    GroupMemberLikeDto,
    GroupJoinRequest,
} from "../types/CommGroupType";
import type { CommTagDto } from "../types/CommTagType";

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

    // ✅ 태그 목록 전체 로드
    const [allTags, setAllTags] = useState<CommTagDto[]>([]);
    useEffect(() => {
        (async () => {
            try {
                const list = await commApi.tag.list(); // GET /api/comm/tags
                setAllTags(list);
            } catch {
                setAllTags([]);
            }
        })();
    }, []);

    // ✅ tagId -> tagName 매핑
    const tagNameById = useMemo(() => {
        const map = new Map<number, string>();
        for (const t of allTags) {
            const name = t.tagName ?? t.tagName;
            if (typeof name === "string" && name.trim()) {
                map.set(t.tagId, name);
            }
        }
        return map;
    }, [allTags]);

    // /me 로드
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

    // 상세
    useEffect(() => {
        if (gid == null) return;

        (async () => {
            setLoading(true);
            setError(null);
            try {
                const d = await commApi.group.detail(gid);
                console.log("detail response:", d); // ✅ 여기서 찍어야 함
                setDetail(d);
            } catch (err: unknown) {
                setError(getErrorMessage(err, "알 수 없는 오류"));
            } finally {
                setLoading(false);
            }
        })();
    }, [gid]);

    // 가입 여부 체크(멤버 목록)
    useEffect(() => {
        if (gid == null) return;

        (async () => {
            try {
                const list = await commApi.member.list(gid);
                setMembers(list);

                if (myId != null) setIsJoined(list.some((m) => m.memberId === myId));
                else setIsJoined(true);

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
            const list = await commApi.member.list(gid);
            setMembers(list);

            if (myId != null) setIsJoined(list.some((m) => m.memberId === myId));
            else setIsJoined(true);
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

            const needPassword = code === "GROUP_PASSWORD_REQUIRED" || msg.includes("비밀번호");
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

    if (gid == null) return <div style={{ padding: 16 }}>잘못된 groupId</div>;
    if (loading) return <div style={{ padding: 16 }}>불러오는 중...</div>;
    if (error) return <div style={{ padding: 16, color: "red" }}>불러오기 실패: {error}</div>;
    if (!detail) return <div style={{ padding: 16 }}>데이터 없음</div>;

    // ✅ 핵심: detail.tagIds -> 이름 매핑
    const tagNames: Array<{ id: number; name: string }> =
        detail.tagIds?.map((id) => ({
            id,
            name: tagNameById.get(id) ?? `tag#${id}`,
        })) ?? [];

    return (
        <div style={{ padding: 16 }}>
            <h2>{detail.groupName}</h2>

            {/* 태그 표시 */}
            <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 8 }}>
                {tagNames.length === 0 ? (
                    <span style={{ opacity: 0.6 }}>태그 없음</span>
                ) : (
                    tagNames.map((t) => (
                        <span
                            key={t.id}
                            style={{
                                padding: "6px 10px",
                                borderRadius: 999,
                                border: "1px solid #ddd",
                                fontSize: 13,
                                opacity: 0.9,
                            }}
                        >
              #{t.name}
            </span>
                    ))
                )}
            </div>

            {detail.groupIntro ? (
                <p style={{ marginTop: 8, opacity: 0.85, whiteSpace: "pre-wrap" }}>{detail.groupIntro}</p>
            ) : (
                <p style={{ marginTop: 8, opacity: 0.6 }}>소개가 없습니다.</p>
            )}

            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                {isJoined ? <button onClick={onLeave}>탈퇴하기</button> : <button onClick={onJoin}>가입하기</button>}
            </div>

            {isJoined && <button onClick={() => navigate(`/groups/${gid}/rankings`)}>랭킹 보기</button>}

            <div style={{ marginTop: 24 }}>
                <h3>멤버</h3>

                {!isJoined ? (
                    <div style={{ opacity: 0.8 }}>가입해야 멤버 목록/투두/좋아요 사용 가능</div>
                ) : memberLoading ? (
                    <div>멤버 불러오는 중...</div>
                ) : memberError ? (
                    <div style={{ color: "red" }}>{memberError}</div>
                ) : (
                    <div style={{ display: "grid", gap: 10 }}>
                        {members.map((m) => (
                            <div key={m.memberId} style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12 }}>
                                <div style={{ fontWeight: 700 }}>{m.nickname}</div>
                                <div style={{ marginTop: 6, fontSize: 14 }}>좋아요 {m.likeCount}</div>

                                <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                                    <button onClick={() => goMemberTodos(m.memberId)}>투두 보기</button>
                                    <button onClick={() => onToggleLike(m.memberId)}>
                                        {m.likedByMe ? "좋아요 취소" : "좋아요"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {isJoined && members.length === 0 && !memberLoading && (
                <div style={{ marginTop: 12 }}>
                    <button onClick={loadMembers}>멤버 불러오기</button>
                </div>
            )}
        </div>
    );
}
