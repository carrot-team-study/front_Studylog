// src/domain/reflection/api/reflectionApi.ts

import type { Reflection } from "../types/reflection";
import api from "../../../global/api";

/**
 * 회고 목록 조회
 */
interface ReflectionResponse {
    reflectionId: number;
    content: string;
    createdAt: string;
}

export const getReflections = async (): Promise<Reflection[]> => {
    // api/index.ts 인터셉터에서 이미 에러 처리 및 data.data 추출을 수행함
    const data = await api.get<ReflectionResponse[]>("/reflections");

    // 백엔드 reflectionId 를 프론트 id로 매핑
    return data.map((r: any) => ({
        id: r.reflectionId,
        content: r.content,
        createdAt: r.createdAt,
    }));
};

/**
 * 회고 작성
 */
export const createReflection = async (content: string) => {
    // 에러 발생 시 인터셉터에서 alert을 띄우고 Promise.reject를 반환함
    await api.post("/reflections", { content });
};

/**
 * 회고 수정
 */
export const updateReflection = async (
    reflectionId: number,
    content: string
) => {
    // PATCH 요청 시 body에 content 전달
    await api.patch(`/reflections/${reflectionId}`, { content });
};

/**
 * 회고 삭제
 */
export const deleteReflection = async (reflectionId: number) => {
    // DELETE 요청 수행
    await api.delete(`/reflections/${reflectionId}`);
};