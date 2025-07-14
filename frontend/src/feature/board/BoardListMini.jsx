import { Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

export function BoardListMini() {
  // boardList는 항상 배열로 초기화
  const [boardList, setBoardList] = useState([]);
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios
      .get("/api/board/list")
      .then((res) => {
        // 서버 응답에서 boardList 키가 배열인지 확인하고 저장
        const list = Array.isArray(res.data.boardList)
          ? res.data.boardList
          : [];
        setBoardList(list);
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
    return <p>불러오는 중...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (boardList.length === 0) {
    return <p>작성된 글이 없습니다.</p>;
  }

  // 최신 3개만 보여줌
  const recentList = boardList.slice(0, 3);

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
          <th style={{ width: "75%" }}>제목</th>
          <th style={{ width: "20%" }}>작성자</th>
          <th style={{ width: "25%" }}>작성일시</th>
        </tr>
      </thead>
      <tbody>
        {recentList.map((board) => (
          <tr
            key={board.id}
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/board/${board.id}`)}
          >
            <td style={{ width: "50px" }}>{board.id}</td>
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
