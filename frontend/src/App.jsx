import { BrowserRouter, Route, Routes } from "react-router";
import { MainLayout } from "./common/MainLayout.jsx";
import { BoardLayout } from "./feature/board/BoardLayout.jsx";
import { BoardList } from "./feature/board/BoardList.jsx";
import { BoardAdd } from "./feature/board/BoardAdd.jsx";
import { BoardDetail } from "./feature/board/BoardDetail.jsx";
import { BoardEdit } from "./feature/board/BoardEdit.jsx";
import { MemberAdd } from "./feature/member/MemberAdd.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<BoardLayout />} />
          <Route path="board/list" element={<BoardList />} />
          <Route path="board/add" element={<BoardAdd />} />
          <Route path="board/:id" element={<BoardDetail />} />
          <Route path="board/edit" element={<BoardEdit />} />
          <Route path="/signup" element={<MemberAdd />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
