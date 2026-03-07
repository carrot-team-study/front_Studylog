import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { commApi } from "../api/commApi";
import type { CommTagDto } from "../types/CommTagType";
import type { CommGroupCreateRequest } from "../api/commApi";

export default function CommGroupCreatePage() {
    const navigate = useNavigate();

    const [groupName, setGroupName] = useState("");
    const [groupIntro, setGroupIntro] = useState("");
    const [maxUser, setMaxUser] = useState(10);

    const [tags, setTags] = useState<CommTagDto[]>([]);
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
    const [submitting, setSubmitting] = useState(false);

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

    const toggleTag = (tagId: number) => {
        setSelectedTagIds((prev) =>
            prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
        );
    };

    const onCreate = async () => {
        if (!groupName.trim()) {
            alert("그룹명을 입력해줘");
            return;
        }
        if (maxUser < 1 || maxUser > 50) {
            alert("정원은 1~50 사이로");
            return;
        }

        const body: CommGroupCreateRequest = {
            groupName: groupName.trim(),
            groupIntro: groupIntro.trim() ? groupIntro : null,
            maxUser,
            tagIds: selectedTagIds.length ? selectedTagIds : null,
        };

        try {
            setSubmitting(true);

            // ✅ create 결과에서 groupId 받기
            const res = await commApi.group.create(body); // { groupId }
            const newGroupId = res.groupId;

            // ✅ 상세로 이동
            navigate(`/groups/${newGroupId}`, { replace: true });
        } catch (e) {
            console.error(e);
            alert("그룹 생성 실패");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ padding: 16 }}>
            <h2>그룹 생성</h2>

            <div style={{ marginTop: 12 }}>
                <div>그룹명</div>
                <input value={groupName} onChange={(e) => setGroupName(e.target.value)} />
            </div>

            <div style={{ marginTop: 12 }}>
                <div>소개</div>
                <textarea value={groupIntro} onChange={(e) => setGroupIntro(e.target.value)} />
            </div>

            <div style={{ marginTop: 12 }}>
                <div>정원</div>
                <input
                    type="number"
                    value={maxUser}
                    onChange={(e) => setMaxUser(Number(e.target.value))}
                    min={1}
                    max={50}
                />
            </div>

            <div style={{ marginTop: 16 }}>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>태그 선택</div>

                {tags.length === 0 ? (
                    <div style={{ opacity: 0.7 }}>태그 목록이 없습니다(태그 API 확인 필요)</div>
                ) : (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {tags.map((t) => {
                            const active = selectedTagIds.includes(t.tagId);
                            return (
                                <button
                                    key={t.tagId}
                                    type="button"
                                    onClick={() => toggleTag(t.tagId)}
                                    style={{
                                        padding: "6px 10px",
                                        borderRadius: 999,
                                        border: "1px solid #ddd",
                                        background: active ? "#222" : "#fff",
                                        color: active ? "#fff" : "#222",
                                        cursor: "pointer",
                                    }}
                                >
                                    #{t.name ?? t.tagName ?? ""}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            <button style={{ marginTop: 20 }} onClick={onCreate} disabled={submitting}>
                {submitting ? "생성 중..." : "생성"}
            </button>
        </div>
    );
}
