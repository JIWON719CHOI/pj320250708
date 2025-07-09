import {
  BrowserRouter,
  Outlet,
  Route,
  Routes,
  useNavigate,
} from "react-router";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function MainLayout() {
  return (
    <div>
      <div>
        navbar
        <a href="/">HOME</a>
        <a href="/board/add">WRITE</a>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}

function BoardLayout() {
  return (
    <div>
      <h3>BOARD_LIST</h3>
    </div>
  );
}

function BoardAdd() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");

  const navigate = useNavigate();

  function handleSaveButtonClick() {
    axios
      .post("/api/board/add", { title, content, author })
      .then((res) => {
        const message = res.data.message;
        // toast 띄우기
        if (message) {
          toast(message.text, { type: message.type });
        }
        // "/" 로 이동
        navigate("/");
      })
      .catch((err) => {
        console.log("ERROR:", err);
      })
      .finally(() => {
        console.log("ALWAYS");
      });
  }

  return (
    <div>
      <h3>BOARD_WRITE</h3>
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <textarea
          id=""
          cols="30"
          rows="10"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
      </div>
      <div>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
      </div>
      <div>
        <button onClick={handleSaveButtonClick}>SAVE</button>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<BoardLayout />} />
          <Route path="board/add" element={<BoardAdd />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
