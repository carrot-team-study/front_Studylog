import { tokenStorage } from "../../domain/member/api/memberApi"; // 경로는 실제 위치에 맞게

function base64UrlDecode(input: string): string {
    const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "===".slice((base64.length + 3) % 4); // padding 보정
    return atob(padded);
}

export function getMyMemberIdFromToken(): number | null {
    const token = tokenStorage.getAccessToken(); // ✅ localStorage 직접 접근 X
    if (!token) return null;

    try {
        const parts = token.split(".");
        if (parts.length < 2) return null;

        const payloadJson = base64UrlDecode(parts[1]);
        const payload = JSON.parse(payloadJson) as Record<string, unknown>;

        // ✅ memberId를 최우선으로, sub는 숫자일 때만
        const raw = payload["memberId"] ?? payload["id"] ?? payload["sub"];
        const n = typeof raw === "string" || typeof raw === "number" ? Number(raw) : NaN;

        return Number.isFinite(n) ? n : null;
    } catch {
        return null;
    }
}
