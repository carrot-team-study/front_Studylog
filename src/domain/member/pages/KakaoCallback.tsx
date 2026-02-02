import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { memberApi, tokenStorage } from '../api/memberApi';

function KakaoCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('카카오 로그인 처리 중...');
  const isProcessing = useRef(false);

  useEffect(() => {
    if (isProcessing.current) return;
    isProcessing.current = true;

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (!code) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus('인가 코드가 없습니다');
      return;
    }

    memberApi.kakaoLogin(code)
      .then((response) => {
        tokenStorage.save(response.accessToken, response.refreshToken);
        setStatus('로그인 성공! 메인 페이지로 이동합니다...');
        setTimeout(() => {
          navigate('/');
        }, 1000);
      })
      .catch((err) => {
        setStatus(`로그인 실패: ${err.message}`);
      });
  }, [navigate]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontSize: '1.2rem',
    }}>
      {status}
    </div>
  );
}

export default KakaoCallback;