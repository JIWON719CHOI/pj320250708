import { Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

export function BoardListMini() {
  const [boardList, setBoardList] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/board/list")
      .then((res) => {
        setBoardList(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  if (!boardList) {
    return <p>불러오는 중...</p>;
  }

  const recentList = boardList.slice(0, 3); // 앞의 3개만 가져옴

  if (recentList.length === 0) {
    return <p>작성된 글이 없습니다.</p>;
  }

  return (
    <Table striped hover size="sm">
      <thead>
        <tr>
          <th>#</th>
          <th>제목</th>
          <th>작성자</th>
          <th>작성일시</th>
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
                maxWidth: "150px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {board.title}
            </td>
            <td
              style={{
                maxWidth: "50px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {board.author}
            </td>
            <td style={{ width: "110px" }}>{board.timesAgo}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
