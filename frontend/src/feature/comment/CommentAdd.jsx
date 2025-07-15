import { Button, FloatingLabel, FormControl, Spinner } from "react-bootstrap";
import { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthenticationContext } from "../../common/AuthenticationContextProvider.jsx";

function CommentAdd({ boardId, onCommentSaved }) {
  const [comment, setComment] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useContext(AuthenticationContext);

  function handleCommentSaveClick() {
    if (!comment.trim()) {
      alert("댓글 내용을 입력하세요.");
      return;
    }

    setIsProcessing(true);

    axios
      .post("/api/comment", { boardId, comment })
      .then(() => {
        setComment("");
        toast.success("댓글이 등록되었습니다.");
        if (onCommentSaved) {
          onCommentSaved(); // 댓글 목록 다시 불러오기
        }
      })
      .catch(() => {
        toast.error("댓글 등록 중 오류가 발생했습니다.");
      })
      .finally(() => {
        setIsProcessing(false);
      }, []);
  }

  const saveButtonDisabled = comment.trim().length === 0;

  return (
    <div className="d-flex align-items-start gap-2 mt-1">
      <FormControl
        as="textarea"
        rows={1}
        className="form-control-sm rounded-3 shadow-sm"
        placeholder={
          user === null
            ? "댓글을 작성하려면 로그인하세요."
            : "댓글을 작성해보세요."
        }
        value={comment}
        onChange={(e) => {
          setComment(e.target.value);
          e.target.style.height = "auto"; // 높이 초기화
          e.target.style.height = e.target.scrollHeight + "px"; // 내용에 맞게 높이 조절
        }}
        disabled={!user}
        style={{
          resize: "none",
          minHeight: "38px",
          maxWidth: "calc(100% - 80px)",
          flexGrow: 1,
          overflow: "hidden",
        }}
      />

      <Button
        disabled={isProcessing || saveButtonDisabled || !user}
        onClick={handleCommentSaveClick}
        variant="primary"
        style={{ minWidth: "70px" }} // 버튼 최소 너비 고정
      >
        {isProcessing ? <Spinner size="sm" animation="border" /> : "등록"}
      </Button>
    </div>
  );
}

export default CommentAdd;
