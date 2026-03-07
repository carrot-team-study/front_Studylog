import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { commApi } from "../api/commApi";
import type { CommTagDto } from "../types/CommTagType";
import type { CommGroupCreateRequest } from "../api/commApi";
import "../css/CommGroupCreatePage.css";

export default function CommGroupCreatePage() {
    const navigate = useNavigate();

    const [groupName, setGroupName] = useState("");
    const [groupIntro, setGroupIntro] = useState("");
    const [maxUser, setMaxUser] = useState(10);

    const [tags, setTags] = useState<CommTagDto[]>([]);
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
    const [submitting, setSubmitting] = useState(false);

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

    const toggleTag = (tagId: number) => {
        setSelectedTagIds((prev) =>
            prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
        );
    };

    const clearTags = () => setSelectedTagIds([]);

    const onCreate = async () => {
        if (!groupName.trim()) {
            alert("그룹명을 입력해줘");
            return;
        }

        if (maxUser < 1 || maxUser > 50) {
            alert("정원은 1~50 사이로 입력해줘");
            return;
        }

        const body: CommGroupCreateRequest = {
            groupName: groupName.trim(),
            groupIntro: groupIntro.trim() ? groupIntro.trim() : null,
            maxUser,
            tagIds: selectedTagIds.length ? selectedTagIds : null,
        };

        try {
            setSubmitting(true);
            const res = await commApi.group.create(body);
            navigate(`/groups/${res.groupId}`, { replace: true });
        } catch (e) {
            console.error(e);
            alert("그룹 생성 실패");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="comm-create-container">
            <header className="page-header">
                <button className="back-btn" onClick={() => navigate(-1)}>←</button>
                <h2>그룹 생성</h2>
                <div style={{ width: 40 }} />
            </header>

            <div className="comm-create-body">
                <div className="create-card">
                    <div className="create-card-top">
                        <h3 className="create-title">새로운 그룹 만들기</h3>
                        <p className="create-subtitle">
                            스터디 목적과 태그를 설정해서 멤버를 모집해보세요.
                        </p>
                    </div>

                    <div className="form-section">
                        <label className="form-label" htmlFor="groupName">
                            그룹명
                        </label>
                        <input
                            id="groupName"
                            className="form-input"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            placeholder="예: SQLD 아침 인증 스터디"
                            maxLength={30}
                        />
                        <div className="form-help">
                            {groupName.length}/30
                        </div>
                    </div>

                    <div className="form-section">
                        <label className="form-label" htmlFor="groupIntro">
                            소개
                        </label>
                        <textarea
                            id="groupIntro"
                            className="form-textarea"
                            value={groupIntro}
                            onChange={(e) => setGroupIntro(e.target.value)}
                            placeholder="그룹 목표, 진행 방식, 모집 대상 등을 적어주세요."
                            maxLength={300}
                        />
                        <div className="form-help">
                            {groupIntro.length}/300
                        </div>
                    </div>

                    <div className="form-section">
                        <label className="form-label" htmlFor="maxUser">
                            정원
                        </label>
                        <div className="max-user-row">
                            <input
                                id="maxUser"
                                className="form-input number-input"
                                type="number"
                                value={maxUser}
                                onChange={(e) => setMaxUser(Number(e.target.value))}
                                min={1}
                                max={50}
                            />
                            <span className="max-user-help">1명 ~ 50명</span>
                        </div>
                    </div>

                    <div className="form-section">
                        <div className="tag-header-row">
                            <label className="form-label" style={{ marginBottom: 0 }}>
                                태그 선택
                            </label>
                            <button
                                type="button"
                                className="tag-reset-btn"
                                onClick={clearTags}
                                disabled={selectedTagIds.length === 0}
                            >
                                태그 초기화
                            </button>
                        </div>

                        {normalizedTags.length === 0 ? (
                            <div className="tag-empty">
                                태그 목록이 없습니다.
                            </div>
                        ) : (
                            <div className="tag-list">
                                {normalizedTags.map((t) => {
                                    const active = selectedTagIds.includes(t.tagId);

                                    return (
                                        <button
                                            key={t.tagId}
                                            type="button"
                                            onClick={() => toggleTag(t.tagId)}
                                            className={`tag-chip ${active ? "active" : ""}`}
                                        >
                                            #{t.tagName}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="create-actions">
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() => navigate(-1)}
                            disabled={submitting}
                        >
                            취소
                        </button>
                        <button
                            type="button"
                            className="submit-btn"
                            onClick={onCreate}
                            disabled={submitting}
                        >
                            {submitting ? "생성 중..." : "그룹 생성"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}