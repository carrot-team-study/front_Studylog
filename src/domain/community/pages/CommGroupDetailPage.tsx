import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getData, postData } from "../../../global/api/http";
import type {
    CommGroupDetailResponse,
    GroupMemberLikeDto,
    LikeToggleResult,
    GroupJoinRequest,
} from "../types/CommGroupType";

type ApiErrorShape = {
    code?: string;
    message?: string;
};

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

    const [loading, setLoading] = useState(true);
    const [memberLoading, setMemberLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [memberError, setMemberError] = useState<string | null>(null);

    // 상세
    useEffect(() => {
        if (gid == null) return;

        (async () => {
            setLoading(true);
            setError(null);
            try {
                const d = await getData<CommGroupDetailResponse>(`/api/comm/${gid}`);
                setDetail(d);
            } catch (err: unknown) {
                setError(getErrorMessage(err, "알 수 없는 오류"));
            } finally {
                setLoading(false);
            }
        })();
    }, [gid]);

    // 멤버 로드(=가입여부 판별)
    const loadMembers = async () => {
        if (gid == null) return;

        setMemberLoading(true);
        setMemberError(null);

        try {
            const list = await getData<GroupMemberLikeDto[]>(`/api/comm/${gid}/members`);
            setMembers(list);
            setIsJoined(true);
        } catch {
            setIsJoined(false);
            setMembers([]);
            // 미가입이면 에러문구 굳이 안 띄움
            setMemberError(null);
        } finally {
            setMemberLoading(false);
        }
    };

    useEffect(() => {
        if (gid == null) return;
        void loadMembers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gid]);

    // 가입 (비번 필요할 때만 prompt)
    const onJoin = async () => {
        if (gid == null) return;

        // 1차: 비번 없이 시도
        try {
            await postData<number, Record<string, never>>(`/api/comm/${gid}/join`, {});
            await loadMembers();
            return;
        } catch (err: unknown) {
            const code = getErrorCode(err);
            const msg = getErrorMessage(err, "");

            const needPassword =
                code === "GROUP_PASSWORD_REQUIRED" ||
                msg.includes("비밀번호"); // fallback

            if (!needPassword) {
                alert(msg || "가입 실패");
                return;
            }
        }

        // 2차: 비번 입력 후 재시도
        const password = window.prompt("비밀번호 입력")?.trim();
        if (!password) return;

        try {
            await postData<number, GroupJoinRequest>(`/api/comm/${gid}/join`, { password });
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

    // 탈퇴
    const onLeave = async () => {
        if (gid == null) return;
        if (!window.confirm("정말 탈퇴할래?")) return;

        try {
            await postData<number>(`/api/comm/${gid}/leave`);
            await loadMembers();
        } catch (err: unknown) {
            alert(getErrorMessage(err, "탈퇴 실패"));
        }
    };

    // 좋아요 토글
    const onToggleLike = async (toUserId: number) => {
        if (gid == null) return;
        if (!isJoined) {
            alert("가입해야 좋아요 가능");
            return;
        }

        try {
            await postData<LikeToggleResult>(`/api/comm/${gid}/members/${toUserId}/like`);
            await loadMembers();
        } catch (err: unknown) {
            alert(getErrorMessage(err, "좋아요 실패"));
        }
    };

    // 멤버 투두 이동
    const goMemberTodos = (memberId: number) => {
        if (!isJoined) {
            alert("가입해야 멤버 투두를 볼 수 있음");
            return;
        }
        navigate(`/groups/${gid}/members/${memberId}/todos`);
    };

    // 렌더 분기
    if (gid == null) return <div style={{ padding: 16 }}>잘못된 groupId</div>;
    if (loading) return <div style={{ padding: 16 }}>불러오는 중...</div>;
    if (error) return <div style={{ padding: 16, color: "red" }}>불러오기 실패: {error}</div>;
    if (!detail) return <div style={{ padding: 16 }}>데이터 없음</div>;

    return (
        <div style={{ padding: 16 }}>
            <h2>{detail.groupName}</h2>

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
                                    <button onClick={() => onToggleLike(m.memberId)}>{m.likedByMe ? "좋아요 취소" : "좋아요"}</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
