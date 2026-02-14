// domain/global/api/http.ts
import type { AxiosRequestConfig } from "axios";
import api from "./api";

type SuccessResponse<T> = {
    success: true;
    code: string;
    message: string;
    data: T;
    timestamp: string;
};

export async function getData<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await api.get<SuccessResponse<T>>(url, config);
    return res.data.data; // ✅ 여기서만 딱 한 번 벗김
}

export async function postData<T, B = unknown>(
    url: string,
    body?: B,
    config?: AxiosRequestConfig
): Promise<T> {
    const res = await api.post<SuccessResponse<T>>(url, body, config);
    return res.data.data;
}

export async function patchData<T, B = unknown>(
    url: string,
    body?: B,
    config?: AxiosRequestConfig
): Promise<T> {
    const res = await api.patch<SuccessResponse<T>>(url, body, config);
    return res.data.data;
}