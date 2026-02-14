export function getMyMemberIdFromToken(): number | null {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;

    try {
        const payload = token.split(".")[1];
        const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));

        // 보통 sub, memberId, id 이런 식임. 네 토큰 payload key에 맞춰 조정
        const v = json.memberId ?? json.id ?? json.sub;
        const n = Number(v);
        return Number.isFinite(n) ? n : null;
    } catch {
        return null;
    }
}