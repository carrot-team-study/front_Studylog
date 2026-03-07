// src/global/api/index.ts
import axios, {
    AxiosError,
    type AxiosInstance,
    type AxiosRequestConfig,
    type InternalAxiosRequestConfig,
} from "axios";
import { ApiError, type ApiResponse, type ErrorResponse } from "../types/api";
import { MessageUtil } from "../utils/messageUtil";
import { ErrorCode, HTTP_STATUS_TO_ERROR_CODE } from "../constants/ResponseCode";
import { tokenStorage } from "../../domain/member/api/memberApi";

// ✅ 요청 옵션 확장: silent=true면 공용 alert 안 띄움
export type ApiRequestConfig = AxiosRequestConfig & {
    silent?: boolean;
};

// ✅ SuccessResponse(=ApiResponse)에서 data만 뽑아주는 axios instance 타입
interface CustomAxiosInstance extends Omit<AxiosInstance, "get" | "post" | "put" | "delete" | "patch"> {
    get<T = unknown>(url: string, config?: ApiRequestConfig): Promise<T>;
    post<T = unknown>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<T>;
    put<T = unknown>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<T>;
    delete<T = unknown>(url: string, config?: ApiRequestConfig): Promise<T>;
    patch<T = unknown>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<T>;
}

const api = axios.create({
    baseURL: "/api",
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
}) as unknown as CustomAxiosInstance;

// 요청 인터셉터: 토큰 자동 주입
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.getAccessToken();

    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    }
    return config;
});

// 응답 인터셉터: 성공 시 data 추출, 실패 시 공용 에러 처리
api.interceptors.response.use(
    (response) => {
        // 204(No Content): 보통 void 취급
        if (response.status === 204) {
            return undefined;
        }

        const body = response.data as ApiResponse<unknown> | undefined;

        // 서버가 { success:true, data: ... } 형태로 주는 케이스
        if (body && body.success === true) {
            return body.data;
        }

        // 서버가 그냥 데이터만 주는 케이스(혹시라도 대비)
        if (response.status >= 200 && response.status < 300) {
            return body ?? response.data ?? undefined;
        }

        return Promise.reject(body ?? { success: false, message: "알 수 없는 응답 형식입니다." });
    },
    (error: AxiosError<ErrorResponse>) => {
        const serverData = error.response?.data;
        const status = error.response?.status;

        const errorMessage = serverData
            ? MessageUtil.getMessageFromResponse(serverData)
            : MessageUtil.getMessageFromHttpStatus(status || 500);

        // ✅ 요청별 silent 옵션: 알럿 끄기 가능
        const silent = (error.config as ApiRequestConfig | undefined)?.silent;
        if (!silent) alert(errorMessage);

        return Promise.reject(
            new ApiError(
                serverData?.code || (status ? HTTP_STATUS_TO_ERROR_CODE[status] : ErrorCode.INTERNAL_SERVER_ERROR),
                errorMessage,
                status,
                serverData?.errors
            )
        );
    }
);

export default api;
