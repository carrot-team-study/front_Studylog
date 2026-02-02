import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from "./domain/member/pages/LoginPage";
import SignupPage from "./domain/member/pages/SignupPage";
import KakaoCallback from "./domain/member/pages/KakaoCallback";
import MainPage from "./pages/MainPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/oauth/kakao" element={<KakaoCallback />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
