import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from "./domain/member/pages/LoginPage";
import SignupPage from "./domain/member/pages/SignupPage";
import KakaoCallback from "./domain/member/pages/KakaoCallback";
import MainPage from "./pages/MainPage";
import ReflectionPage from "./domain/reflection/pages/ReflectionPage.tsx";
import TimerPage from "./domain/timer/pages/TimerPage.tsx";
import TodoPage from "./domain/todo/pages/TodoPage.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/oauth/kakao" element={<KakaoCallback />} />
        <Route path="/reflections" element={<ReflectionPage />} />
        <Route path="/timer" element={<TimerPage />} />
        <Route path="/todos" element={<TodoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
