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

export type CommGroupDetailResponse = {
    groupId: number;
    groupName: string;
    groupIntro?: string;
    dailyGoal?: number;
    maxUser: number;
    memberCount: number;
    createdAt: string;

    // 태그가 내려오면 이런식 (너 실제 응답에 맞춰 수정)
    tags?: { tagId: number; tagName: string }[];

    // 비공개 여부 같은 값이 있으면 추가
    // isPrivate?: boolean;
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