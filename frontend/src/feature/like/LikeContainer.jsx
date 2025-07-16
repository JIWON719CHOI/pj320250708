import { FaThumbsUp } from "react-icons/fa";
import axios from "axios";
import { useState, useEffect } from "react";

export function LikeContainer({ boardId }) {
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    fetchLikeCount();
  }, []);

  function fetchLikeCount() {
    axios
      .get("/api/like/count", { params: { boardId } })
      .then((res) => setLikeCount(res.data));
  }

  function handleThumbsClick() {
    axios
      .put("/api/like", { boardId })
      .then(() => fetchLikeCount())
      .catch((err) => console.error(err));
  }

  return (
    <div className="d-flex gap-2 h2">
      <div onClick={handleThumbsClick} style={{ cursor: "pointer" }}>
        <FaThumbsUp />
      </div>
      <div>{likeCount}</div>
    </div>
  );
}
