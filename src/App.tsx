import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from "./domain/member/pages/LoginPage";
import SignupPage from "./domain/member/pages/SignupPage";
import KakaoCallback from "./domain/member/pages/KakaoCallback";
import MainPage from "./pages/MainPage";
import CommGroupListPage from "./domain/community/pages/CommGroupListPage.tsx";
import CommGroupDetailPage from "./domain/community/pages/CommGroupDetailPage.tsx";
import GroupMemberTodoPage from "./domain/community/pages/GroupMemberTodoPage.tsx";
import CommGroupCreatePage from "./domain/community/pages/CommGroupCreatePage.tsx";
import MyGroupListPage from "./domain/community/pages/MyGroupListPage.tsx";
import CommGroupRankingPage from "./domain/community/pages/CommGroupRankingPage.tsx";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/oauth/kakao" element={<KakaoCallback />} />
        <Route path="/comm/list" element={<CommGroupListPage />} />
        <Route path="/groups/:groupId" element={<CommGroupDetailPage />} />
        <Route path="/groups/:groupId/members/:memberId/todos" element={<GroupMemberTodoPage />} />
        <Route path="/groups/new" element={<CommGroupCreatePage />} />
        <Route path="/my/groups" element={<MyGroupListPage />} />
        <Route path="/groups/:groupId/rankings" element={<CommGroupRankingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
