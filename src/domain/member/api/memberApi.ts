const API_BASE = '/api/member';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  nickname: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export const memberApi = {
  login: async (request: LoginRequest): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || '로그인에 실패했습니다');
    }

    return response.json();
  },

  signup: async (request: SignupRequest): Promise<void> => {
    const response = await fetch(`${API_BASE}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || '회원가입에 실패했습니다');
    }
  },

  kakaoLogin: (code: string): Promise<LoginResponse> => {
    return fetch(`${API_BASE}/login/oauth/kakao?code=${code}`)
      .then((res) => {
        if (!res.ok) throw new Error('카카오 로그인에 실패했습니다');
        return res.json();
      });
  },

  getKakaoAuthUrl: (): string => {
    const clientId = '888a81fc89e638d651dbe63e0eac5cb1';
    const redirectUri = encodeURIComponent('http://localhost:5173/oauth/kakao');
    return `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
  },
};

export const tokenStorage = {
  save: (accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  },

  getAccessToken: (): string | null => {
    return localStorage.getItem('accessToken');
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem('refreshToken');
  },

  clear: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
};