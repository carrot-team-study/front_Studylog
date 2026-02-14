import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from "./domain/member/pages/LoginPage";
import SignupPage from "./domain/member/pages/SignupPage";
import KakaoCallback from "./domain/member/pages/KakaoCallback";
import MainPage from "./pages/MainPage";
import SubjectPage from "./domain/subject/pages/SubjectPage.tsx";
import StatisticsPage from "./domain/stat/pages/StatisticsPage.tsx";
import PlanPage from "./domain/plan/pages/PlanPage.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/oauth/kakao" element={<KakaoCallback />} />
        <Route path="/subjects" element={<SubjectPage />} />
        <Route path="/statistics" element={<StatisticsPage />} />
        <Route path="/plans" element={<PlanPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
