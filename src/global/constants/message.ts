// src/global/constants/message.ts

import { ErrorCode, SuccessCode } from './ResponseCode';

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
    // COMMON
    [ErrorCode.INTERNAL_SERVER_ERROR]: '서버 내부 오류',
    [ErrorCode.INVALID_REQUEST]: '잘못된 요청입니다.',
    [ErrorCode.METHOD_NOT_ALLOWED]: '지원하지 않는 메서드입니다.',
    [ErrorCode.UNSUPPORTED_MEDIA_TYPE]: '지원하지 않는 Content-Type입니다.',
    [ErrorCode.NOT_FOUND]: '존재하지 않는 API입니다.',
    [ErrorCode.VALIDATION_FAIL]: '요청 값 검증에 실패했습니다.',
    [ErrorCode.EMPTY_BODY]: '요청 본문이 비어있습니다.',
    [ErrorCode.MISSING_PARAMETER]: '요청 파라미터가 누락되었습니다.',

    // AUTH
    [ErrorCode.UNAUTHORIZED]: '인증이 필요합니다.',
    [ErrorCode.INVALID_TOKEN]: '유효하지 않은 토큰입니다.',
    [ErrorCode.EXPIRED_TOKEN]: '만료된 토큰입니다.',
    [ErrorCode.FORBIDDEN]: '권한이 없습니다.',
    [ErrorCode.LOGIN_FAILED]: '로그인 정보가 올바르지 않습니다.',
    [ErrorCode.LOGIN_TRY_EXCEEDED]: '로그인 시도 횟수를 초과했습니다.',
    [ErrorCode.LOGOUT_FAILED]: '로그아웃 처리할 수 없습니다.',

    // USER
    [ErrorCode.DUPLICATE_EMAIL]: '이미 사용 중인 이메일입니다.',
    [ErrorCode.USER_NOT_FOUND]: '사용자를 찾을 수 없습니다.',
    [ErrorCode.PASSWORD_MISMATCH]: '비밀번호가 올바르지 않습니다.',
    [ErrorCode.INVALID_NEW_PASSWORD]: '새 비밀번호가 기준에 맞지 않습니다.',
    [ErrorCode.SAME_AS_OLD_PASSWORD]: '새 비밀번호가 기존과 같습니다.',
    [ErrorCode.WITHDRAWN_USER]: '탈퇴한 사용자입니다.',
    [ErrorCode.PROFILE_IMAGE_NOT_FOUND]: '프로필 이미지가 없습니다.',
    [ErrorCode.FILE_TOO_LARGE]: '파일 크기가 너무 큽니다.',
    [ErrorCode.UNSUPPORTED_FILE_TYPE]: '지원하지 않는 파일 형식입니다.',
    [ErrorCode.INVALID_VERIFICATION_CODE]: '인증 코드가 올바르지 않습니다.',
    [ErrorCode.EXPIRED_VERIFICATION_CODE]: '인증 코드가 만료되었습니다.',
    [ErrorCode.TOO_MANY_REQUESTS]: '요청이 너무 많습니다.',

    // KAKAO
    [ErrorCode.KAKAO_AUTH_FAILED]: '카카오 인증에 실패했습니다.',
    [ErrorCode.INVALID_KAKAO_AUTH_CODE]: '카카오 인가 코드가 유효하지 않습니다.',
    [ErrorCode.KAKAO_BAD_GATEWAY]: '카카오 서버 응답이 올바르지 않습니다.',
    [ErrorCode.KAKAO_EMAIL_CONFLICT]: '이미 다른 방식으로 가입된 이메일입니다.',

    // SUBJECT
    [ErrorCode.SUBJECT_NOT_FOUND]: '과목을 찾을 수 없습니다.',
    [ErrorCode.DUPLICATE_SUBJECT_NAME]: '이미 존재하는 과목명입니다.',
    [ErrorCode.INVALID_SUBJECT_COLOR]: '과목 색상 값이 올바르지 않습니다.',
    [ErrorCode.SUBJECT_DELETE_NOT_ALLOWED]: '과목을 삭제할 수 없습니다.',
    [ErrorCode.SUBJECT_FORBIDDEN]: '과목 접근 권한이 없습니다.',

    // RESOURCE
    [ErrorCode.RESOURCE_NOT_FOUND]: '리소스를 찾을 수 없습니다.',
    [ErrorCode.INVALID_UNIT_COUNT]: '단원 수가 올바르지 않습니다.',
    [ErrorCode.INVALID_PROGRESS_VALUE]: '진도 값이 올바르지 않습니다.',
    [ErrorCode.RESOURCE_FORBIDDEN]: '리소스 접근 권한이 없습니다.',
    [ErrorCode.RESOURCE_DELETE_NOT_ALLOWED]: '리소스를 삭제할 수 없습니다.',

    // PLAN
    [ErrorCode.PLAN_NOT_FOUND]: '계획을 찾을 수 없습니다.',
    [ErrorCode.INVALID_TARGET_DATE]: '목표 날짜가 올바르지 않습니다.',
    [ErrorCode.INVALID_PRIORITY]: '우선순위 값이 올바르지 않습니다.',
    [ErrorCode.PLAN_ALREADY_DONE]: '이미 완료 처리된 계획입니다.',
    [ErrorCode.PLAN_FORBIDDEN]: '계획 접근 권한이 없습니다.',
    [ErrorCode.PLAN_VISIBILITY_NOT_ALLOWED]: '공개 설정이 허용되지 않습니다.',

    // TIMER
    [ErrorCode.TIMER_ALREADY_RUNNING]: '이미 실행 중인 타이머가 있습니다.',
    [ErrorCode.TIMER_NOT_RUNNING]: '실행 중인 타이머가 없습니다.',
    [ErrorCode.INVALID_TIMER_TIME]: '타이머 시간 값이 올바르지 않습니다.',
    [ErrorCode.TIMER_ALREADY_ENDED]: '이미 종료 처리된 타이머입니다.',
    [ErrorCode.INVALID_MANUAL_TIME]: '수동 기록 시간이 올바르지 않습니다.',
    [ErrorCode.TIMER_RATE_LIMIT]: '너무 자주 호출했습니다.',
    [ErrorCode.TIMER_CONCURRENCY_CONFLICT]: '동시 수정 충돌이 발생했습니다.',
    [ErrorCode.TIMER_MAX_TIME_EXCEEDED]: '최대 학습시간 제한을 초과했습니다.',
    [ErrorCode.TIMER_ALREADY_PAUSED]: '이미 일시정지된 상태입니다.',

    // REFLECTION
    [ErrorCode.REFLECTION_NOT_FOUND]: '회고를 찾을 수 없습니다.',
    [ErrorCode.REFLECTION_ALREADY_EXISTS]: '해당 날짜의 회고가 이미 존재합니다.',
    [ErrorCode.REFLECTION_FORBIDDEN]: '회고 접근 권한이 없습니다.',
    [ErrorCode.INVALID_REFLECTION_CONTENT]: '회고 내용이 올바르지 않습니다.',

    // TODOLIST
    [ErrorCode.TODO_NOT_FOUND]: '투두리스트를 찾을 수 없습니다.',
    [ErrorCode.TODO_FORBIDDEN]: '해당 Todo에 대한 접근 권한이 없습니다.',
    [ErrorCode.INVALID_TODO_DATE]: 'Todo 날짜 형식이 올바르지 않습니다.',
    [ErrorCode.TODO_ALREADY_COMPLETED]: '이미 완료된 Todo입니다.',
    [ErrorCode.INVALID_TODO_CONTENT]: 'Todo 내용이 비어있거나 너무 깁니다.',

    // STATS
    [ErrorCode.INVALID_STATS_RANGE]: '조회 기간이 올바르지 않습니다.',
    [ErrorCode.STATS_RANGE_TOO_LARGE]: '조회 범위가 너무 큽니다.',
    [ErrorCode.STATS_CALCULATION_ERROR]: '통계 계산 중 오류가 발생했습니다.',

    // GROUP
    [ErrorCode.GROUP_NOT_FOUND]: '그룹을 찾을 수 없습니다.',
    [ErrorCode.GROUP_FULL]: '그룹 정원이 가득 찼습니다.',
    [ErrorCode.NOT_GROUP_MEMBER]: '그룹 멤버가 아닙니다.',
    [ErrorCode.GROUP_ADMIN_REQUIRED]: '그룹 관리자 권한이 필요합니다.',
    [ErrorCode.ALREADY_GROUP_MEMBER]: '이미 가입된 그룹입니다.',
    [ErrorCode.GROUP_JOIN_PENDING]: '가입 승인 대기 중입니다.',
    [ErrorCode.INVALID_GROUP_PASSWORD]: '그룹 비밀번호가 올바르지 않습니다.',
    [ErrorCode.CANNOT_KICK_TARGET]: '강퇴할 수 없는 대상입니다.',
    [ErrorCode.INVALID_GROUP_SETTING]: '그룹 설정 값이 올바르지 않습니다.',
    [ErrorCode.INVITE_LINK_EXPIRED]: '초대 링크가 만료되었습니다.',

    // LIKE / RANK
    [ErrorCode.LIKE_ALREADY_SENT]: '이미 좋아요를 보냈습니다.',
    [ErrorCode.LIKE_SELF_NOT_ALLOWED]: '자기 자신에게 좋아요를 보낼 수 없습니다.',
    [ErrorCode.LIKE_GROUP_MEMBER_ONLY]: '그룹 멤버만 사용할 수 있습니다.',
    [ErrorCode.INVALID_RANK_FILTER]: '랭킹 필터 값이 올바르지 않습니다.',
    [ErrorCode.RANK_CALCULATION_ERROR]: '랭킹 계산 중 오류가 발생했습니다.',

    // NOTIFICATION
    [ErrorCode.NOTIFICATION_SEND_FAILED]: '알림 발송에 실패했습니다.',
    [ErrorCode.INVALID_NOTIFICATION_SETTING]: '알림 설정 값이 올바르지 않습니다.',
    [ErrorCode.NOTIFICATION_TARGET_NOT_FOUND]: '알림 대상을 찾을 수 없습니다.',

    // INFRA
    [ErrorCode.SERVICE_UNAVAILABLE]: '일시적으로 서비스를 사용할 수 없습니다.',
    [ErrorCode.REDIS_ERROR]: '캐시/세션 서버 오류입니다.',
    [ErrorCode.RATE_LIMIT]: '요청이 너무 많습니다.',
    [ErrorCode.LOCK_FAIL]: '처리 중입니다. 잠시 후 다시 시도해주세요.',

};

export const SUCCESS_MESSAGES: Record<SuccessCode, string> = {
    // COMMON
    [SuccessCode.OK]: '요청 성공',
    [SuccessCode.CREATED]: '생성 성공',
    [SuccessCode.NO_CONTENT]: '처리 성공',

    // AUTH
    [SuccessCode.LOGIN_SUCCESS]: '로그인 성공',
    [SuccessCode.LOGOUT_SUCCESS]: '로그아웃 성공',
    [SuccessCode.TOKEN_REISSUE_SUCCESS]: '토큰 재발급 성공',

    // USER
    [SuccessCode.SIGNUP_SUCCESS]: '회원가입 성공',
    [SuccessCode.WITHDRAW_SUCCESS]: '회원탈퇴 성공',
    [SuccessCode.PASSWORD_CHANGE_SUCCESS]: '비밀번호 변경 성공',
    [SuccessCode.PROFILE_IMAGE_UPLOAD_SUCCESS]: '프로필 이미지 등록 성공',
    [SuccessCode.PROFILE_IMAGE_UPDATE_SUCCESS]: '프로필 이미지 수정 성공',
    [SuccessCode.PROFILE_IMAGE_DELETE_SUCCESS]: '프로필 이미지 삭제 성공',

    // SUBJECT
    [SuccessCode.SUBJECT_CREATE_SUCCESS]: '과목 등록 성공',
    [SuccessCode.SUBJECT_UPDATE_SUCCESS]: '과목 수정 성공',
    [SuccessCode.SUBJECT_DELETE_SUCCESS]: '과목 삭제 성공',
    [SuccessCode.SUBJECT_LIST_SUCCESS]: '과목 목록 조회 성공',

    // RESOURCE
    [SuccessCode.RESOURCE_CREATE_SUCCESS]: '리소스 등록 성공',
    [SuccessCode.RESOURCE_UPDATE_SUCCESS]: '리소스 수정 성공',
    [SuccessCode.RESOURCE_DELETE_SUCCESS]: '리소스 삭제 성공',
    [SuccessCode.RESOURCE_LIST_SUCCESS]: '리소스 목록 조회 성공',
    [SuccessCode.RESOURCE_DETAIL_SUCCESS]: '리소스 상세 조회 성공',

    // PLAN
    [SuccessCode.PLAN_CREATE_SUCCESS]: '계획 등록 성공',
    [SuccessCode.PLAN_UPDATE_SUCCESS]: '계획 수정 성공',
    [SuccessCode.PLAN_DELETE_SUCCESS]: '계획 삭제 성공',
    [SuccessCode.PLAN_COMPLETE_SUCCESS]: '계획 완료 처리 성공',
    [SuccessCode.PLAN_LIST_BY_DATE_SUCCESS]: '날짜별 계획 조회 성공',

    // TIMER
    [SuccessCode.TIMER_START_SUCCESS]: '타이머 시작 성공',
    [SuccessCode.TIMER_END_SUCCESS]: '타이머 종료 성공',
    [SuccessCode.TIMER_AUTO_END_SUCCESS]: '타이머 자동 종료 성공',
    [SuccessCode.STUDY_LOG_LIST_SUCCESS]: '학습기록 조회 성공',
    [SuccessCode.STUDY_LOG_SUMMARY_SUCCESS]: '학습기록 요약 성공',
    [SuccessCode.TIMER_STATUS_SUCCESS]: '타이머 상태 조회 성공',
    [SuccessCode.TIMER_PAUSE_SUCCESS]: '타이머 일시정지 성공',
    [SuccessCode.TIMER_RESUME_SUCCESS]: '타이머 재개 성공',
    [SuccessCode.MANUAL_STUDY_LOG_SUCCESS]: '수동 학습 기록 성공',

    // REFLECTION
    [SuccessCode.REFLECTION_CREATE_SUCCESS]: '회고 작성 성공',
    [SuccessCode.REFLECTION_UPDATE_SUCCESS]: '회고 수정 성공',
    [SuccessCode.REFLECTION_DELETE_SUCCESS]: '회고 삭제 성공',
    [SuccessCode.REFLECTION_DAILY_SUCCESS]: '회고 일별 조회 성공',
    [SuccessCode.REFLECTION_LIST_SUCCESS]: '회고 목록 조회 성공',

    // TODOLIST
    [SuccessCode.TODO_CREATE_SUCCESS]: 'Todo 등록 성공',
    [SuccessCode.TODO_UPDATE_SUCCESS]: 'Todo 수정 성공',
    [SuccessCode.TODO_DELETE_SUCCESS]: 'Todo 삭제 성공',
    [SuccessCode.TODO_STATUS_UPDATE_SUCCESS]: 'Todo 상태 변경 성공',
    [SuccessCode.TODO_LIST_SUCCESS]: 'Todo 목록 조회 성공',
    [SuccessCode.TODO_LIST_BY_DATE_SUCCESS]: '날짜별 Todo 목록 조회 성공',

    // STATS
    [SuccessCode.DASHBOARD_MAIN_SUCCESS]: '메인 대시보드 조회 성공',
    [SuccessCode.WEEKLY_STATS_SUCCESS]: '주간 통계 조회 성공',
    [SuccessCode.MONTHLY_STATS_SUCCESS]: '월간 통계 조회 성공',
    [SuccessCode.ATTENDANCE_CALENDAR_SUCCESS]: '출석 달력 조회 성공',

    // GROUP
    [SuccessCode.GROUP_CREATE_SUCCESS]: '그룹 생성 성공',
    [SuccessCode.GROUP_JOIN_SUCCESS]: '그룹 가입 성공',
    [SuccessCode.GROUP_JOIN_REQUEST_SUCCESS]: '그룹 가입 요청 성공',
    [SuccessCode.GROUP_MEMBER_LIST_SUCCESS]: '그룹원 목록 조회 성공',
    [SuccessCode.GROUP_ROLE_UPDATE_SUCCESS]: '권한 변경 성공',
    [SuccessCode.GROUP_KICK_SUCCESS]: '그룹원 강퇴 성공',
    [SuccessCode.GROUP_PLAN_LIST_SUCCESS]: '그룹 내 계획 조회 성공',

    // RANK / LIKE
    [SuccessCode.GROUP_RANKING_SUCCESS]: '그룹 랭킹 조회 성공',
    [SuccessCode.LIKE_SEND_SUCCESS]: '좋아요 전송 성공',

    // NOTIFICATION
    [SuccessCode.NOTIFICATION_LIST_SUCCESS]: '알림 조회 성공',
    [SuccessCode.NOTIFICATION_READ_SUCCESS]: '알림 읽음 처리 성공',
    [SuccessCode.NOTIFICATION_SETTING_UPDATE_SUCCESS]: '알림 설정 변경 성공',

};