import { Button, FormControl } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export function CommentContainer({ boardId, onCommentSaved }) {
  const [comment, setComment] = useState("");

  // 댓글 저장 처리
  function handleCommentSaveClick() {
    if (!comment.trim()) {
      alert("댓글 내용을 입력하세요.");
      return;
    }

    axios
      .post("/api/comment", { boardId: boardId, comment: comment })
      .then(() => {
        setComment("");
        toast.success("댓글이 등록되었습니다.");
        // 댓글 저장 성공 시 부모 컴포넌트에서 댓글 목록을 다시 불러올 수 있게 콜백 호출
        if (onCommentSaved) {
          onCommentSaved();
        }
      })
      .catch(() => {
        toast.error("댓글 등록 중 오류가 발생했습니다.");
      });
  }

  return (
    <div>
      <h3>댓글 창</h3>
      <FormControl
        as="textarea"
        rows={3}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <Button onClick={handleCommentSaveClick} className="mt-2">
        댓글 저장
      </Button>
    </div>
  );
}
