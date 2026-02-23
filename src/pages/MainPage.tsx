// src/pages/MainPage.tsx
import { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { tokenStorage } from '../domain/member/api/memberApi';
import { notificationApi } from '../domain/notification/api/notificationApi';
import NotificationModal from '../domain/notification/components/NotificationModal';
import './MainPage.css';

interface UserInfo {
  nickname: string;
  email: string;
}

function MainPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 유저 정보 로드
  useEffect(() => {
    const token = tokenStorage.getAccessToken();
    if (!token) { navigate('/login'); return; }

    fetch('/api/member/me', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => { if (!res.ok) throw new Error('인증 실패'); return res.json(); })
      .then((data) => setUser(data))
      .catch(() => { tokenStorage.clear(); navigate('/login'); });
  }, [navigate]);

  // 미읽음 수 초기 로드 + SSE 실시간 구독
  useEffect(() => {
    const token = tokenStorage.getAccessToken();
    if (!token) return;

    // 초기 미읽음 수 조회
    notificationApi.getUnreadCount().then(setUnreadCount).catch(() => {});

    // SSE 실시간 알림 수신
    const unsubscribe = notificationApi.subscribeSSE(
      () => {
        // 새 알림 수신 시 미읽음 수 갱신
        notificationApi.getUnreadCount().then(setUnreadCount).catch(() => {});
      },
      () => {}, // SSE 에러 무시
    );

    return unsubscribe;
  }, []);

  const handleLogout = () => {
    tokenStorage.clear();
    navigate('/login');
  };

  return (
    <div className="main-container">
      <header className="main-header">
        <h1>Studylog</h1>
        <div className="header-right" ref={menuRef}>
          {user && <span className="user-name">{user.nickname}님</span>}

          {/* 알림 버튼 */}
          <div className="notif-wrapper">
            <button
              className="notif-btn"
              onClick={() => { setMenuOpen(false); setNotifOpen(true); }}
            >
              🔔
            </button>
            {unreadCount > 0 && (
              <span className="notif-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
            )}
          </div>

          {/* 햄버거 메뉴 */}
          <button className="hamburger-btn" onClick={() => setMenuOpen((prev) => !prev)}>
            <span /><span /><span />
          </button>
          {menuOpen && (
            <div className="dropdown-menu">
              <button onClick={() => { setMenuOpen(false); navigate('/mypage'); }}>마이페이지</button>
              <button onClick={() => { setMenuOpen(false); handleLogout(); }}>로그아웃</button>
            </div>
          )}
        </div>
      </header>

      <main className="main-content">
        <div className="welcome-card">
          <h2>환영합니다!</h2>
          <p>오늘도 열심히 공부해봐요</p>
        </div>
        <div className="feature-grid">
          <div className="feature-card" onClick={() => navigate('/timer')} style={{ cursor: 'pointer' }}>
            <div className="feature-icon">⏱️</div>
            <h3>타이머</h3>
            <p>공부 시간을 측정하세요</p>
          </div>
        </div>
        <NavLink to="/subjects" className="feature-card">
          <div className="feature-icon">📚</div>
          <h3>과목 관리</h3>
          <p>과목을 추가하고 관리하세요</p>
        </NavLink>
        <NavLink to="/plans" className="feature-card">
          <div className="feature-icon">📅</div>
          <h3>플래너</h3>
          <p>학습 계획을 세우세요</p>
        </NavLink>
        <NavLink to="/statistics" className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>통계</h3>
          <p>학습 기록을 확인하세요</p>
        </NavLink>
        <div className="feature-card" onClick={() => setNotifOpen(true)} style={{ cursor: 'pointer' }}>
          <div className="feature-icon">🔔</div>
          <h3>알림</h3>
          <p>학습 리마인더를 받으세요</p>
        </div>
        <div className="feature-card" onClick={() => navigate('/reflections')} style={{ cursor: 'pointer' }}>
          <div className="feature-icon">📝</div>
          <h3>회고</h3>
          <p>오늘의 공부를 기록하세요</p>
        </div>
        <div className="feature-card" onClick={() => navigate('/todos')} style={{ cursor: 'pointer' }}>
          <div className="feature-icon">📝</div>
          <h3>투두</h3>
          <p>오늘의 투두리스트를 계획해보세요</p>
        </div>
        <div
          className="feature-card"
          role="button"
          onClick={() => navigate('/comm/list')}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate('/comm/list'); }}
        >
          <div className="feature-icon">✍️</div>
          <h3>커뮤니티</h3>
          <p>함께 공부를 해보아요</p>
        </div>
      </main>

      {notifOpen && (
        <NotificationModal
          onClose={() => setNotifOpen(false)}
          onUnreadChange={setUnreadCount}
        />
      )}
    </div>
  );
}

export default MainPage;