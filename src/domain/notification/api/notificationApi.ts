import { tokenStorage } from '../../member/api/memberApi';

export interface NotificationDto {
  notificationId: number;
  notificationType: string;
  notificationTitle: string;
  notificationContent: string;
  notificationRead: boolean;
  createdAt: string;
  readAt: string | null;
}

const BASE = '/api/notifications';

const authHeader = () => ({
  Authorization: `Bearer ${tokenStorage.getAccessToken() ?? ''}`,
});

export const notificationApi = {
  getAll: async (): Promise<NotificationDto[]> => {
    const res = await fetch(BASE, { headers: authHeader() });
    if (!res.ok) throw new Error('알림 조회 실패');
    return res.json();
  },

  getUnreadCount: async (): Promise<number> => {
    const res = await fetch(`${BASE}/unread-count`, { headers: authHeader() });
    if (!res.ok) throw new Error('미읽음 조회 실패');
    return res.json();
  },

  markAsRead: async (notificationId: number): Promise<void> => {
    await fetch(`${BASE}/${notificationId}/read`, {
      method: 'PATCH',
      headers: authHeader(),
    });
  },

  delete: async (notificationId: number): Promise<void> => {
    await fetch(`${BASE}/${notificationId}`, {
      method: 'DELETE',
      headers: authHeader(),
    });
  },

  // EventSource는 헤더 미지원 → fetch 스트림으로 SSE 구현
  subscribeSSE: (
    onNotification: (data: NotificationDto) => void,
    onError?: () => void,
  ): (() => void) => {
    const controller = new AbortController();

    fetch(`${BASE}/subscribe`, {
      headers: authHeader(),
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.body) return;
        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        const read = () => {
          reader.read().then(({ done, value }) => {
            if (done) return;
            const text = decoder.decode(value, { stream: true });
            // SSE 형식 파싱: "data: {...}\n\n"
            const lines = text.split('\n');
            for (const line of lines) {
              if (line.startsWith('data:')) {
                const json = line.replace(/^data:\s*/, '').trim();
                if (!json) continue;
                try {
                  const parsed: NotificationDto = JSON.parse(json);
                  onNotification(parsed);
                } catch {
                  // heartbeat 등 무시
                }
              }
            }
            read();
          }).catch(() => onError?.());
        };

        read();
      })
      .catch(() => onError?.());

    return () => controller.abort();
  },
};