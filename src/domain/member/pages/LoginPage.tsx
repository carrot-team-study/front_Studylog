import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/LoginPage.css';
import { memberApi, tokenStorage } from '../api/memberApi';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await memberApi.login({ email, password });
      tokenStorage.save(response.accessToken, response.refreshToken);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleKakaoLogin = () => {
    window.location.href = memberApi.getKakaoAuthUrl();
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>Studylog</h1>
          <p>공부 기록을 시작하세요</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className="divider">
          <span>또는</span>
        </div>

        <button className="kakao-btn" onClick={handleKakaoLogin}>
          <svg className="kakao-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.47 1.607 4.647 4.035 5.906-.178.663-.454 1.398-.795 2.136-.32.692-.178 1.458.695 1.458.378 0 .756-.126 1.134-.378 1.134-.756 2.268-1.512 3.402-2.268.504.063 1.008.126 1.529.126 5.523 0 10-3.477 10-7.5S17.523 3 12 3z"/>
          </svg>
          카카오로 시작하기
        </button>

        <div className="signup-link">
          <span>계정이 없으신가요?</span>
          <Link to="/signup">회원가입</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;