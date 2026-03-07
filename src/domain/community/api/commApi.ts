// src/domain/community/api/commApi.ts
import api, { type ApiRequestConfig } from "../../../global/api";
import type {
    Page,
    GroupListDto,
    CommGroupSort,
    CommGroupDetailResponse,
    GroupMemberLikeDto,
    LikeToggleResult,
    GroupJoinRequest,
    RankRowDto,
    MyGroupListDto,
    MeResponse,
} from "../types/CommGroupType";
import type { TodoResponse } from "../types/TodoType";

export type CommGroupCreateRequest = {
    groupName: string;
    groupIntro?: string | null;
    maxUser: number;
    dailyGoal?: number | null;
    password?: string | null;
    passwordConfirm?: string | null;
    tagIds?: number[] | null;
};

export type CommGroupCreateResponse = { groupId: number };

type RankingParams = {
    limit: number;
    date?: string;
};

type GroupListParams = {
    keyword?: string;
    order?: CommGroupSort;
    page?: number;
    size?: number;
    tagIds?: number[];
};

const BASE_URL = "/comm";

export const commApi = {
    group: {
        list(params: GroupListParams, config?: ApiRequestConfig) {
            return api.get<Page<GroupListDto>>(BASE_URL, { ...config, params });
        },
        detail(groupId: number, config?: ApiRequestConfig) {
            return api.get<CommGroupDetailResponse>(`${BASE_URL}/${groupId}`, config);
        },
        create(body: CommGroupCreateRequest, config?: ApiRequestConfig) {
            return api.post<CommGroupCreateResponse>(BASE_URL, body, config);
        },
        join(groupId: number, body?: GroupJoinRequest, config?: ApiRequestConfig) {
            return api.post<number>(`${BASE_URL}/${groupId}/join`, body ?? {}, config);
        },
        leave(groupId: number, config?: ApiRequestConfig) {
            return api.post<number>(`${BASE_URL}/${groupId}/leave`, undefined, config);
        },
    },

    member: {
        list(groupId: number, config?: ApiRequestConfig) {
            return api.get<GroupMemberLikeDto[]>(`${BASE_URL}/${groupId}/members`, config);
        },

        toggleLike(groupId: number, toUserId: number, config?: ApiRequestConfig) {
            return api.post<LikeToggleResult>(
                `${BASE_URL}/${groupId}/members/${toUserId}/like`,
                undefined,
                config
            );
        },

        todos(groupId: number, memberId: number, date: string, config?: ApiRequestConfig) {
            return api.get<TodoResponse[]>(`${BASE_URL}/${groupId}/members/${memberId}/todos`, {
                ...config,
                params: { date },
            });
        },

        /**
         * ✅ 커뮤니티(그룹) 투두 완료/취소
         * PATCH /api/comm/{gid}/members/{mid}/todos/{todoId}/complete?completed=true|false
         *
         * ⚠️ 백엔드에 이 API가 있어야 함. (없으면 404)
         */
        updateTodoComplete(
            groupId: number,
            memberId: number,
            todoId: number,
            completed: boolean,
            config?: ApiRequestConfig
        ) {
            return api.patch(
                `${BASE_URL}/${groupId}/members/${memberId}/todos/${todoId}/complete`,
                null,
                {
                    ...config,
                    params: { completed },
                }
            );
        },
    },

    ranking: {
        likes(groupId: number, params: RankingParams, config?: ApiRequestConfig) {
            return api.get<RankRowDto[]>(`${BASE_URL}/${groupId}/rankings/likes`, {
                ...config,
                params,
            });
        },
        todos(groupId: number, params: RankingParams, config?: ApiRequestConfig) {
            return api.get<RankRowDto[]>(`${BASE_URL}/${groupId}/rankings/todos`, {
                ...config,
                params,
            });
        },
    },

    my: {
        groups(page: number, size: number, config?: ApiRequestConfig) {
            return api.get<Page<MyGroupListDto>>(`${BASE_URL}/me/groups`, {
                ...config,
                params: { page, size },
            });
        },
    },

    me(config?: ApiRequestConfig) {
        return api.get<MeResponse>("/me", config);
    },

    // commApi.ts
    tag: {
        list() {
            return api.get<{ tagId: number; tagName: string }[]>(`/comm/tags`);
        },
    },

};
