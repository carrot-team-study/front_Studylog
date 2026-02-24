import { useEffect, useState } from 'react';
import { notificationApi } from '../api/notificationApi';
import type { NotificationDto } from '../api/notificationApi';
import '../css/NotificationModal.css';

interface Props {
  onClose: () => void;
  onUnreadChange: (count: number) => void;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return '방금 전';
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}시간 전`;
  return `${Math.floor(h / 24)}일 전`;
}

function typeLabel(type: string): string {
  const map: Record<string, string> = {
    LIKE: '좋아요',
    FRIEND: '친구',
    STATISTICS: '통계',
    STUDY: '공부',
  };
  return map[type] ?? type;
}

function NotificationModal({ onClose, onUnreadChange }: Props) {
  const [notifications, setNotifications] = useState<NotificationDto[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const data = await notificationApi.getAll();
      setNotifications(data);
      const unread = data.filter((n) => !n.notificationRead).length;
      onUnreadChange(unread);
    } catch {
      // 조회 실패 시 빈 목록 유지
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMarkAsRead = async (id: number) => {
    await notificationApi.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => n.notificationId === id ? { ...n, notificationRead: true } : n)
    );
    const unread = notifications.filter((n) => !n.notificationRead && n.notificationId !== id).length;
    onUnreadChange(unread);
  };

  const handleDelete = async (id: number) => {
    await notificationApi.delete(id);
    const updated = notifications.filter((n) => n.notificationId !== id);
    setNotifications(updated);
    onUnreadChange(updated.filter((n) => !n.notificationRead).length);
  };

  const handleMarkAllRead = async () => {
    const unread = notifications.filter((n) => !n.notificationRead);
    await Promise.all(unread.map((n) => notificationApi.markAsRead(n.notificationId)));
    setNotifications((prev) => prev.map((n) => ({ ...n, notificationRead: true })));
    onUnreadChange(0);
  };

  const unreadCount = notifications.filter((n) => !n.notificationRead).length;

  return (
    <div className="notif-overlay" onClick={onClose}>
      <div className="notif-panel" onClick={(e) => e.stopPropagation()}>
        <div className="notif-header">
          <h3>알림 {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}</h3>
          <div className="notif-header-actions">
            {unreadCount > 0 && (
              <button className="mark-all-btn" onClick={handleMarkAllRead}>
                모두 읽음
              </button>
            )}
            <button className="notif-close-btn" onClick={onClose}>✕</button>
          </div>
        </div>

        <div className="notif-body">
          {loading ? (
            <div className="notif-empty">
              <p>불러오는 중...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="notif-empty">
              <svg className="notif-empty-icon" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
              </svg>
              <p>새로운 알림이 없습니다</p>
            </div>
          ) : (
            <ul className="notif-list">
              {notifications.map((n) => (
                <li
                  key={n.notificationId}
                  className={`notif-item${n.notificationRead ? ' read' : ''}`}
                  onClick={() => !n.notificationRead && handleMarkAsRead(n.notificationId)}
                >
                  <div className="notif-dot" />
                  <div className="notif-text">
                    <span className="notif-type-tag">{typeLabel(n.notificationType)}</span>
                    <p className="notif-title">{n.notificationTitle}</p>
                    <p className="notif-message">{n.notificationContent}</p>
                    <span className="notif-time">{timeAgo(n.createdAt)}</span>
                  </div>
                  <button
                    className="notif-delete-btn"
                    onClick={(e) => { e.stopPropagation(); handleDelete(n.notificationId); }}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationModal;