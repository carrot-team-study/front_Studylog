/**
 * Subject 도메인과 직접 의존하지 않기 위한 Adapter 레이어.
 * 추후 subjectApi.ts가 완성되면 이 파일 내부만 수정하면 됨.
 */
import axios from "axios";


export interface TimerSubject {
    subjectId: number;
    subjectName: string;
}

export const getUserSubjects = async (): Promise<TimerSubject[]> => {
    const rawAxios = axios.create({
        baseURL: "/api",
        withCredentials: true
    });

    const response = await rawAxios.get("/sbjects", {
        headers: { memberId: 31 }
    });

    return response.data;
};

