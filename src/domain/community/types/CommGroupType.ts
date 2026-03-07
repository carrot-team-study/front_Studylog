// domain/community/types/CommGroupType.ts
export type SuccessResponse<T> = {
    success: boolean;
    code: string;
    message: string;
    data: T;
    timestamp: string;
};

export type GroupListDto = {
    groupId: number;
    groupName: string;
    memberCount: number;
    createdAt: string;
};

export type Page<T> = {
    content: T[];
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
};

// src/domain/community/types/CommGroupType.ts
export type CommGroupDetailResponse = {
    groupId: number;
    groupName: string;
    groupIntro?: string | null;
    dailyGoal?: number | null;
    maxUser: number;
    memberCount: number;
    createdAt: string;

    tagIds?: number[]; // ✅ 서버가 실제로 주는 형태
};

// domain/community/types/CommGroupType.ts
export type GroupMemberLikeDto = {
    memberId: number;
    nickname: string;
    likeCount: number;
    likedByMe: boolean;
};

export type LikeToggleResult = {
    liked: boolean;
    likeCount: number;
};

export type GroupJoinRequest = {
    password?: string;
};

export type MyGroupListDto = {
    groupId: number;
    groupName: string;
    groupIntro: string | null;
    memberCount: number;   // Integer라 number
    maxUser: number;       // Long도 number로 받음
    createdAt: string;
    role: "OWNER" | "MEMBER" | string;
};

export type CommGroupSort = "NEW" | "OLD" | "GOAL_DESC" | "MEMBERS_DESC";

export type RankRowDto = {
    memberId: number;
    nickname: string;
    score: number; // likeCount나 완료 개수
};


export type MeResponse = {
    memberId: number;
};