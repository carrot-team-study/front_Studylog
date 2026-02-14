// src/global/types/api.ts
import { SuccessCode, ErrorCode } from '../constants/ResponseCode';

/**
 * 기본 API 응답 인터페이스
 * (백엔드에서 공통으로 사용하는 기본 틀)
 */
export interface ApiResponse<T = unknown> {
    success: boolean;
    code: SuccessCode | ErrorCode;
    message: string;
    data?: T;
    timestamp?: string;
}

/**
 * 성공 응답 타입
 * 백엔드: com.studylog.api.global.common.response.SuccessResponse
 */
export interface SuccessResponse<T = unknown> extends ApiResponse<T> {evelop
    success: true;
    code: SuccessCode;
    data: T;
}

/**
 * 에러 응답 타입
 * 백엔드: com.studylog.api.global.common.response.ErrorResponse
 */
export interface ErrorResponse extends ApiResponse<never> {
    success: false;
    code: ErrorCode;
    data?: never;
    errors?: ValidationErrors; // 유효성 검증 에러 상세 정보
}

/**
 * 유효성 검증 에러 상세 정보
 * 필드명을 key로, 에러 메시지를 value로 가지는 객체
 */
export interface ValidationErrors {
    [field: string]: string;
}

/**
 * API 에러 객체 (axios 에러 래핑용)
 */
export class ApiError extends Error {
    public readonly code: ErrorCode;
    public readonly status?: number;
    public readonly validationErrors?: ValidationErrors;

    constructor(
        code: ErrorCode,
        message: string,
        status?: number,
        validationErrors?: ValidationErrors
    ) {
        super(message);
        this.name = 'ApiError';
        this.code = code;
        this.status = status;
        this.validationErrors = validationErrors;

        // ES5 환경에서 instanceof가 제대로 동작하도록 프로토타입 설정
        if (typeof Object.setPrototypeOf === 'function') {
            Object.setPrototypeOf(this, ApiError.prototype);
        }
    }

    /**
     * 유효성 검증 에러 여부 확인
     */
    public hasValidationErrors(): boolean {
        return !!this.validationErrors && Object.keys(this.validationErrors).length > 0;
    }

    /**
     * 특정 필드의 유효성 검증 에러 메시지 가져오기
     */
    public getFieldError(field: string): string | undefined {
        return this.validationErrors?.[field];
    }
}

/**
 * 타입 가드: 성공 응답인지 확인
 */
export function isSuccessResponse<T>(
    response: ApiResponse<T>
): response is SuccessResponse<T> {
    return response.success === true;
}

/**
 * 타입 가드: 에러 응답인지 확인
 */
export function isErrorResponse(response: ApiResponse): response is ErrorResponse {
    return response.success === false;
}