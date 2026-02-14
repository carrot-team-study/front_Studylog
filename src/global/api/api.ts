// domain/global/api/api.ts
import axios from "axios";

type ErrorResponse = {
    success: false;
    code: string;
    message: string;
    errors?: { field: string; reason: string }[];
    timestamp: string;
    path: string;
};

const api = axios.create({
    headers: { "Content-Type": "application/json" },
    // baseURL 있으면 여기에 넣어
    // baseURL: import.meta.env.VITE_API_BASE_URL,
});

// ✅ request: 토큰 자동 첨부(필요하면)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ✅ response: 에러코드/메시지 꺼내서 Error 객체에 심기
api.interceptors.response.use(
    (res) => res,
    (error) => {
        const data = error?.response?.data as Partial<ErrorResponse> | undefined;
        const msg = data?.message ?? error?.message ?? "네트워크 오류";
        const err = new Error(msg);
        (err as any).code = data?.code; // ✅ 여기!
        throw err;
    }
);

export default api;
