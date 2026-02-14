import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postData } from "../../../global/api/http";

type CommGroupCreateRequest = {
    groupName: string;
    groupIntro?: string | null;
    maxUser: number;
    dailyGoal?: number | null;
    password?: string | null;
    passwordConfirm?: string | null;
    tagIds?: number[] | null;
};

type CommGroupCreateResponse = { groupId: number };

export default function CommGroupCreatePage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [groupName, setGroupName] = useState("");
    const [groupIntro, setGroupIntro] = useState("");
    const [maxUser, setMaxUser] = useState(10);
    const [dailyGoal, setDailyGoal] = useState<number | "">("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    const onSubmit = async () => {
        if (!groupName.trim()) return alert("그룹명을 입력해줘");
        if (maxUser < 1 || maxUser > 50) return alert("정원은 1~50");

        if (isPrivate) {
            if (!password.trim()) return alert("비밀번호 입력");
            if (password !== passwordConfirm) return alert("비밀번호 확인이 다름");
        }

        const body: CommGroupCreateRequest = {
            groupName: groupName.trim(),
            groupIntro: groupIntro.trim() || null,
            maxUser,
            dailyGoal: dailyGoal === "" ? null : Number(dailyGoal),
            password: isPrivate ? password : null,
            passwordConfirm: isPrivate ? passwordConfirm : null,
            tagIds: null, // 태그 붙일 거면 여기 넣기
        };

        try {
            setLoading(true);
            const res = await postData<CommGroupCreateResponse, CommGroupCreateRequest>("/api/comm", body);
            alert("그룹 생성 완료");
            navigate(`/groups/${res.groupId}`);
        } catch (e: any) {
            alert(e?.message ?? "생성 실패");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: 16, maxWidth: 560 }}>
            <h3>그룹 만들기</h3>

            <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
                <label>
                    <div style={{ fontSize: 13, opacity: 0.8 }}>그룹명</div>
                    <input value={groupName} onChange={(e) => setGroupName(e.target.value)} />
                </label>

                <label>
                    <div style={{ fontSize: 13, opacity: 0.8 }}>소개</div>
                    <textarea
                        value={groupIntro}
                        onChange={(e) => setGroupIntro(e.target.value)}
                        rows={4}
                        style={{ width: "100%" }}
                    />
                </label>

                <label>
                    <div style={{ fontSize: 13, opacity: 0.8 }}>정원(1~50)</div>
                    <input
                        type="number"
                        value={maxUser}
                        onChange={(e) => setMaxUser(Number(e.target.value))}
                        min={1}
                        max={50}
                    />
                </label>

                <label>
                    <div style={{ fontSize: 13, opacity: 0.8 }}>일일 목표량(선택)</div>
                    <input
                        type="number"
                        value={dailyGoal}
                        onChange={(e) => setDailyGoal(e.target.value === "" ? "" : Number(e.target.value))}
                        min={0}
                    />
                </label>

                <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input type="checkbox" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} />
                    비공개(비밀번호 필요)
                </label>

                {isPrivate && (
                    <>
                        <label>
                            <div style={{ fontSize: 13, opacity: 0.8 }}>비밀번호</div>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </label>

                        <label>
                            <div style={{ fontSize: 13, opacity: 0.8 }}>비밀번호 확인</div>
                            <input
                                type="password"
                                value={passwordConfirm}
                                onChange={(e) => setPasswordConfirm(e.target.value)}
                            />
                        </label>
                    </>
                )}

                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <button onClick={() => navigate(-1)} disabled={loading}>
                        취소
                    </button>
                    <button onClick={onSubmit} disabled={loading}>
                        {loading ? "생성중..." : "생성"}
                    </button>
                </div>
            </div>
        </div>
    );
}