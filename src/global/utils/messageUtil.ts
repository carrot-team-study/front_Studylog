/**
 * 메시지 유틸리티
 * API 응답 코드(SuccessCode, ErrorCode)를 사용자에게 보여줄 한글 메시지로 변환
 */
import { SuccessCode, ErrorCode, HTTP_STATUS_TO_ERROR_CODE } from '../constants/ResponseCode';
import type { ApiResponse, ErrorResponse } from '../types/api';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants/message.ts";

/**
 * 서비스 전용 메시지 처리 유틸리티 클래스
 */
export class MessageUtil {
    /**
     * 성공 코드에 해당하는 메시지 반환
     */
    static getSuccessMessage(code: SuccessCode): string {
        return SUCCESS_MESSAGES[code] || '요청이 성공적으로 처리되었습니다.';
    }

    /**
     * 에러 코드에 해당하는 메시지 반환
     */
    static getErrorMessage(code: ErrorCode): string {
        return ERROR_MESSAGES[code] || '시스템 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
    }

    /**
     * 응답 코드(성공/에러)에 따른 통합 메시지 반환
     */
    static getMessage(code: SuccessCode | ErrorCode): string {
        if ((Object.values(SuccessCode) as string[]).includes(code)) {
            return this.getSuccessMessage(code as SuccessCode);
        }
        if ((Object.values(ErrorCode) as string[]).includes(code)) {
            return this.getErrorMessage(code as ErrorCode);
        }
        return '알 수 없는 응답 코드입니다.';
    }

    /**
     * API 응답 객체에서 최종 메시지 추출
     * 1순위: 백엔드에서 직접 보내준 실시간 message
     * 2순위: 백엔드 응답 코드에 매핑된 프론트엔드 기본 메시지
     */
    static getMessageFromResponse(response: ApiResponse): string {
        if (!response) return '응답 데이터를 찾을 수 없습니다.';

        // 백엔드에서 가변적인 메시지를 보냈다면 그것을 우선함
        if (response.message) {
            return response.message;
        }
        // 없다면 사전에 정의한 코드로 메시지 조회
        return this.getMessage(response.code);
    }

    /**
     * 네트워크 에러 등 HTTP 상태 코드만 있을 때 메시지 반환
     */
    static getMessageFromHttpStatus(status: number, defaultMessage?: string): string {
        const errorCode = HTTP_STATUS_TO_ERROR_CODE[status];
        if (errorCode) {
            return this.getErrorMessage(errorCode);
        }
        return defaultMessage || `서버와 통신 중 오류가 발생했습니다. (Status: ${status})`;
    }

    /**
     * 유효성 검증 에러 응답에서 첫 번째 메시지 추출
     */
    static getValidationErrorMessage(errorResponse: ErrorResponse): string | null {
        if (!errorResponse.errors || Object.keys(errorResponse.errors).length === 0) {
            return null;
        }
        const firstField = Object.keys(errorResponse.errors)[0];
        return errorResponse.errors[firstField];
    }

    /**
     * 특정 필드(예: 'email')에 대한 에러 메시지만 추출
     */
    static getFieldErrorMessage(errorResponse: ErrorResponse, fieldName: string): string | null {
        return errorResponse.errors?.[fieldName] || null;
    }
}

/**
 * 컴포넌트에서 더 짧게 쓰기 위한 export 함수들
 */
export const getSuccessMessage = (code: SuccessCode) => MessageUtil.getSuccessMessage(code);
export const getErrorMessage = (code: ErrorCode) => MessageUtil.getErrorMessage(code);
export const getMessageFromResponse = (response: ApiResponse) => MessageUtil.getMessageFromResponse(response);