import { Table, Spinner, Alert } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

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
          <th style={{ width: "60px" }}>#</th>
          <th style={{ width: "50%" }}>제목</th>
          <th style={{ width: "20%" }}>작성자</th>
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
            <td
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              title={board.title}
            >
              {board.title}
            </td>
            <td
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              title={board.author}
            >
              {board.author}
            </td>
            <td style={{ whiteSpace: "nowrap" }}>{board.timesAgo}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
