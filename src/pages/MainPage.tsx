import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokenStorage } from '../domain/member/api/memberApi';
import './MainPage.css';

interface UserInfo {
  nickname: string;
  email: string;
}

function MainPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const token = tokenStorage.getAccessToken();
    if (!token) {
      navigate('/login');
      return;
    }

    fetch('/api/member/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('인증 실패');
        return res.json();
      })
      .then((data) => setUser(data))
      .catch(() => {
        tokenStorage.clear();
        navigate('/login');
      });
  }, [navigate]);

  const handleLogout = () => {
    tokenStorage.clear();
    navigate('/login');
  };

  return (
    <div className="main-container">
      <header className="main-header">
        <h1>Studylog</h1>
        <div className="header-right">
          {user && <span className="user-name">{user.nickname}님</span>}
          <button className="logout-btn" onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </header>

      <main className="main-content">
        <div className="welcome-card">
          <h2>환영합니다!</h2>
          <p>오늘도 열심히 공부해봐요</p>
        </div>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">⏱️</div>
            <h3>타이머</h3>
            <p>공부 시간을 측정하세요</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>플래너</h3>
            <p>학습 계획을 세우세요</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>통계</h3>
            <p>학습 기록을 확인하세요</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔔</div>
            <h3>알림</h3>
            <p>학습 리마인더를 받으세요</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MainPage;