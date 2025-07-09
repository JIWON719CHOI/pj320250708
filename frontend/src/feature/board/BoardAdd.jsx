import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";

export function BoardAdd() {
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