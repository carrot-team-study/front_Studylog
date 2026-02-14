import axios, { AxiosError, type AxiosInstance, type AxiosResponse } from "axios";
import { ApiError, type ApiResponse, type ErrorResponse } from "../types/api.ts";
import { MessageUtil } from "../utils/messageUtil.ts";
import { ErrorCode, HTTP_STATUS_TO_ERROR_CODE } from "../constants/ResponseCode.ts";
// 기존에 토큰을 관리하던 storage를 가져옵니다.
import { tokenStorage } from "../../domain/member/api/memberApi.ts";

const api = axios.create({
    baseURL: "/api",
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// 요청 인터셉터: 토큰 자동 주입
api.interceptors.request.use((config) => {
    // 기존에 검증된 tokenStorage를 사용하여 토큰을 가져옵니다.
    const token = tokenStorage.getAccessToken();

    if (token) {
        // 백엔드 스펙에 맞춰 'Bearer ' 접두사 처리
        config.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }
    return config;
});

// 응답 인터셉터: 성공 시 데이터 추출, 실패 시 공용 에러 처리
api.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
        // 1. HTTP 상태 코드가 204(No Content)인 경우 본문이 없으므로 즉시 성공 반환
        if (response.status === 204) {
            return true;
        }

        const { data } = response;

        // 2. 응답 데이터(body)가 존재하고 success 필드가 true인 경우 data만 반환
        if (data && data.success) {
            return data.data;
        }

        // 3. 만약 data(body)는 없지만 HTTP 상태 코드가 성공(200~299)인 경우 성공 처리
        if (!data && response.status >= 200 && response.status < 300) {
            return true;
        }

        // 그 외엔 비즈니스 에러로 간주하여 reject (data가 없을 경우를 대비해 처리)
        return Promise.reject(data || { success: false, message: '알 수 없는 응답 형식입니다.' });
    },
    (error: AxiosError<ErrorResponse>) => {
        const serverData = error.response?.data;
        const status = error.response?.status;

        // MessageUtil로 사용자 메시지 추출
        const errorMessage = serverData
            ? MessageUtil.getMessageFromResponse(serverData)
            : MessageUtil.getMessageFromHttpStatus(status || 500);

        // 공용 alert 처리 (컴포넌트에서 매번 alert을 띄울 필요가 없음)
        alert(errorMessage);

        // 에러 객체 생성 및 반환
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

/**
 * 응답 인터셉터가 data 필드를 자동으로 추출하므로 반환 타입을 Promise<T>로 정의
 */
interface CustomAxiosInstance extends AxiosInstance {
    get<T = any>(url: string, config?: any): Promise<T>;
    post<T = any>(url: string, data?: any, config?: any): Promise<T>;
    put<T = any>(url: string, data?: any, config?: any): Promise<T>;
    delete<T = any>(url: string, config?: any): Promise<T>;
    patch<T = any>(url: string, data?: any, config?: any): Promise<T>;
}

export default api as unknown as CustomAxiosInstance;