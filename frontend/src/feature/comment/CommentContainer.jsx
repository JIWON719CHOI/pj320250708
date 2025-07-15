import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import CommentAdd from "./CommentAdd";
import CommentList from "./CommentList";

export function CommentContainer({ boardId }) {
  const [commentList, setCommentList] = useState([]);

  function fetchComments() {
    axios
      .get(`/api/comment/list?boardId=${boardId}`)
      .then((res) => {
        console.log("댓글 목록:", res.data);
        setCommentList(Array.isArray(res.data) ? res.data : res.data.comments); // 구조에 따라 조절
      })
      .catch(() => {
        toast.error("댓글 목록 불러오기 실패");
      });
  }

  useEffect(() => {
    fetchComments();
  }, [boardId]);

  return (
    <div>
      <h3>댓글 창</h3>
      <CommentList comments={commentList} />
      <CommentAdd boardId={boardId} onCommentSaved={fetchComments} />
    </div>
  );
}
