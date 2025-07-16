import { Table, Spinner, Alert, Badge } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { FaComment, FaRegComments, FaThumbsUp } from "react-icons/fa";

export function BoardListMini() {
  const [boardList, setBoardList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError(null);

    axios
      .get("/api/board/list")
      .then((res) => {
        const list = Array.isArray(res.data.boardList)
          ? res.data.boardList
          : [];
        setBoardList(list.slice(0, 3)); // 여기서 미리 3개 자름
      })
      .catch((err) => {
        console.error(err);
        setError("게시글을 불러오는 중 오류가 발생했습니다.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="text-center my-3">
        <Spinner animation="border" size="sm" /> 불러오는 중...
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="my-3">
        {error}
      </Alert>
    );
  }

  if (boardList.length === 0) {
    return <p className="text-muted mt-2">작성된 글이 없습니다.</p>;
  }

  return (
    <Table
      striped
      hover
      size="sm"
      style={{ tableLayout: "fixed", width: "100%" }}
    >
      <thead>
        <tr>
          <th style={{ width: "45px" }}>#</th>
          <th style={{ width: "45px" }}>
            <FaThumbsUp size={14} className="text-secondary text-black" />
          </th>
          <th style={{ width: "95%" }}>제목</th>
          <th style={{ width: "30%" }}>작성자</th>
          <th style={{ width: "30%" }}>작성일시</th>
        </tr>
      </thead>
      <tbody>
        {boardList.map((board) => (
          <tr
            key={board.id}
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/board/${board.id}`)}
          >
            <td>{board.id}</td>
            <td>
              <span className="ms-1" style={{ fontSize: "0.85em" }}>
                {board.countLike}
              </span>
            </td>
            <td>
              <div className="d-flex gap-2">
                <span>{board.title}</span>
                <span>
                  {board.countComment > 0 && (
                    <Badge bg="light" text="dark">
                      <div className="d-flex gap-1">
                        <FaRegComments />
                        <span>{board.countComment}</span>
                      </div>
                    </Badge>
                  )}
                </span>
              </div>
            </td>
            <td
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              title={board.nickName}
            >
              {board.nickName}
            </td>
            <td style={{ whiteSpace: "nowrap" }}>{board.timesAgo}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
