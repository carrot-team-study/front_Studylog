// domain/global/api/api.ts
import axios, { AxiosError } from "axios";

type ErrorResponse = {
    success: false;
    code: string;
    message: string;
    errors?: { field: string; reason: string }[];
    timestamp: string;
    path: string;
};

export class ApiError extends Error {
    code?: string;

    constructor(message: string, code?: string) {
        super(message);
        this.name = "ApiError";
        this.code = code;
    }
}

const api = axios.create({
    headers: { "Content-Type": "application/json" },
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

// ✅ response: 에러코드/메시지 꺼내서 ApiError로 던지기
api.interceptors.response.use(
    (res) => res,
    (error: unknown) => {
        const axiosErr = error as AxiosError<Partial<ErrorResponse>>;
        const data = axiosErr.response?.data;

        const msg = data?.message ?? axiosErr.message ?? "네트워크 오류";
        throw new ApiError(msg, data?.code);
    }
);

export default api;
