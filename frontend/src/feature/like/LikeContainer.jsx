import { FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { OverlayTrigger, Spinner, Tooltip } from "react-bootstrap";
import { AuthenticationContext } from "../../common/AuthenticationContextProvider.jsx";

export function LikeContainer({ boardId }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [likeInfo, setLikeInfo] = useState(null);
  const { user } = useContext(AuthenticationContext);

  // 좋아요 정보 불러오기 (상태 변경은 호출하는 곳에서 처리)
  function fetchLikeInfo() {
    return axios
      .get(`/api/like/board/${boardId}`)
      .then((res) => {
        setLikeInfo(res.data);
      })
      .catch((err) => {
        console.error("좋아요 정보 불러오기 실패:", err);
      });
  }

  useEffect(() => {
    setIsProcessing(true);
    fetchLikeInfo().finally(() => setIsProcessing(false));
  }, [boardId]);

  function handleThumbsClick() {
    if (isProcessing) return;

    setIsProcessing(true);
    axios
      .put("/api/like", { boardId })
      .then(() => fetchLikeInfo())
      .catch((err) => {
        console.error("좋아요 처리 실패:", err);
      })
      .finally(() => setIsProcessing(false));
  }

  // 초기 로딩 시
  if (!likeInfo) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ height: "2rem" }}
      >
        <Spinner animation="border" size="sm" />
      </div>
    );
  }

  return (
    <div className="d-flex gap-2 h2 align-items-center">
      {user === null ? (
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id="tooltip1">로그인 하세요</Tooltip>}
        >
          {/* tabIndex=0으로 키보드 포커스도 가능하게 */}
          <span tabIndex={0} style={{ cursor: "not-allowed" }}>
            <FaRegThumbsUp />
          </span>
        </OverlayTrigger>
      ) : (
        <div
          onClick={handleThumbsClick}
          style={{
            cursor: isProcessing ? "not-allowed" : "pointer",
            userSelect: "none",
          }}
          aria-disabled={isProcessing}
          title={likeInfo.liked ? "좋아요 취소" : "좋아요"}
        >
          {isProcessing ? (
            <Spinner animation="grow" size="sm" />
          ) : likeInfo.liked ? (
            <FaThumbsUp color="black" />
          ) : (
            <FaRegThumbsUp />
          )}
        </div>
      )}
      <div>{likeInfo.count}</div>
    </div>
  );
}
