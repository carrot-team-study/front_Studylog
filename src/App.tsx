import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from "./domain/member/pages/LoginPage";
import SignupPage from "./domain/member/pages/SignupPage";
import KakaoCallback from "./domain/member/pages/KakaoCallback";
import MainPage from "./pages/MainPage";
import ReflectionPage from "./domain/reflection/pages/ReflectionPage.tsx";
import TimerPage from "./domain/timer/pages/TimerPage.tsx";
import TodoPage from "./domain/todo/pages/TodoPage.tsx";
import CommGroupListPage from "./domain/community/pages/CommGroupListPage.tsx";
import CommGroupDetailPage from "./domain/community/pages/CommGroupDetailPage.tsx";
import GroupMemberTodoPage from "./domain/community/pages/GroupMemberTodoPage.tsx";
import CommGroupCreatePage from "./domain/community/pages/CommGroupCreatePage.tsx";
import MyGroupListPage from "./domain/community/pages/MyGroupListPage.tsx";
import CommGroupRankingPage from "./domain/community/pages/CommGroupRankingPage.tsx";
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
        <Route path="/reflections" element={<ReflectionPage />} />
        <Route path="/timer" element={<TimerPage />} />
        <Route path="/todos" element={<TodoPage />} />
        <Route path="/comm/list" element={<CommGroupListPage />} />
        <Route path="/groups/:groupId" element={<CommGroupDetailPage />} />
        <Route path="/groups/:groupId/members/:memberId/todos" element={<GroupMemberTodoPage />} />
        <Route path="/groups/new" element={<CommGroupCreatePage />} />
        <Route path="/my/groups" element={<MyGroupListPage />} />
        <Route path="/groups/:groupId/rankings" element={<CommGroupRankingPage />} />
        <Route path="/subjects" element={<SubjectPage />} />
        <Route path="/statistics" element={<StatisticsPage />} />
        <Route path="/plans" element={<PlanPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
