import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokenStorage } from '../api/memberApi';
import { statisticsApi } from '../../stat/api/statisticsApi';
import '../css/MyPage.css';

interface UserInfo {
  nickname: string;
  email: string;
  profilePhoto: string | null;
}

function MyPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [todaySeconds, setTodaySeconds] = useState<number>(0);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchUser = () => {
    const token = tokenStorage.getAccessToken();
    if (!token) { navigate('/login'); return; }

    fetch('/api/member/me', {
      headers: { Authorization: `Bearer ${token}` },
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
  };

  useEffect(() => {
    fetchUser();
    statisticsApi.getTodayTotal().then((sec) => setTodaySeconds(sec)).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}시간 ${m}분`;
    return `${m}분`;
  };

  const getInitial = (name: string) => name.charAt(0).toUpperCase();

  const handleLogout = () => {
    tokenStorage.clear();
    navigate('/login');
  };

  // 이미지 파일 선택 → base64로 변환 후 PATCH
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = tokenStorage.getAccessToken();
    if (!token) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const profilePhotoUrl = reader.result as string;
      try {
        setUploading(true);
        const res = await fetch('/api/member/profile-photo', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ profilePhotoUrl }),
        });
        if (!res.ok) throw new Error('업로드 실패');
        fetchUser();
      } catch {
        alert('이미지 업로드에 실패했습니다.');
      } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  // 이미지 삭제
  const handleDeletePhoto = async () => {
    if (!confirm('프로필 사진을 삭제할까요?')) return;
    const token = tokenStorage.getAccessToken();
    if (!token) return;

    try {
      const res = await fetch('/api/member/profile-photo', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('삭제 실패');
      fetchUser();
    } catch {
      alert('이미지 삭제에 실패했습니다.');
    }
  };

  const menuItems = [
    { icon: '⏱️', label: '타이머', path: '/timer' },
    { icon: '📚', label: '과목 관리', path: '/subjects' },
    { icon: '📅', label: '플래너', path: '/plans' },
    { icon: '📊', label: '통계', path: '/statistics' },
    { icon: '📝', label: '회고', path: '/reflections' },
    { icon: '✅', label: '할 일', path: '/todos' },
    { icon: '👥', label: '커뮤니티', path: '/comm/list' },
  ];

  return (
    <div className="mypage-container">
      <header className="mypage-header">
        <button className="back-btn" onClick={() => navigate('/')}>←</button>
        <h2>마이페이지</h2>
        <div style={{ width: 40 }} />
      </header>

      <div className="mypage-body">
        {/* 프로필 카드 */}
        <div className="profile-card">
          <div className="avatar-wrapper">
            <div className="avatar">
              {user?.profilePhoto ? (
                <img src={user.profilePhoto} alt="프로필" className="avatar-img" />
              ) : (
                user ? getInitial(user.nickname) : '?'
              )}
            </div>
            {/* 이미지 변경/삭제 버튼 */}
            <div className="avatar-actions">
              <button
                className="avatar-action-btn"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                title="사진 변경"
              >
                {uploading ? '⏳' : '📷'}
              </button>
              {user?.profilePhoto && (
                <button
                  className="avatar-action-btn delete"
                  onClick={handleDeletePhoto}
                  title="사진 삭제"
                >
                  🗑️
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </div>

          <div className="profile-info">
            <p className="profile-name">{user?.nickname}님</p>
            <p className="profile-email">{user?.email}</p>
          </div>
        </div>

        {/* 오늘 공부 현황 */}
        <div className="stat-section">
          <p className="stat-label">오늘 공부시간</p>
          <p className="stat-value">
            {todaySeconds > 0 ? formatTime(todaySeconds) : '아직 없음'}
          </p>
        </div>

        {/* 메뉴 리스트 */}
        <div className="menu-section">
          {menuItems.map((item) => (
            <button
              key={item.path}
              className="menu-item"
              onClick={() => navigate(item.path)}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{item.label}</span>
              <span className="menu-arrow">›</span>
            </button>
          ))}
        </div>

        {/* 로그아웃 */}
        <button className="logout-btn" onClick={handleLogout}>
          로그아웃
        </button>
      </div>
    </div>
  );
}

export default MyPage;