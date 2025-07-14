import { Col, Row, Spinner, Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

export function BoardList() {
  const [boardList, setBoardList] = useState(null);
  const navigate = useNavigate();

  // 작성일시를 상대 시간 문자열로 바꿔주는 함수
  function getTimesAgo(insertedAt) {
    const now = new Date();
    const past = new Date(insertedAt);
    const diffSec = Math.floor((now - past) / 1000);

    if (diffSec < 60) return "방금 전";
    if (diffSec < 3600) return Math.floor(diffSec / 60) + "분 전";
    if (diffSec < 86400) return Math.floor(diffSec / 3600) + "시간 전";
    if (diffSec < 604800) return Math.floor(diffSec / 86400) + "일 전";
    if (diffSec < 2419200) return Math.floor(diffSec / 604800) + "주 전";
    return past.toLocaleDateString();
  }

  useEffect(() => {
    axios
      .get("/api/board/list")
      .then((res) => {
        console.log("잘 될 때 코드");
        setBoardList(res.data);
      })
      .catch((err) => {
        console.log("잘 안될 때 코드", err);
      })
      .finally(() => {
        console.log("항상 실행 코드");
      });
  }, []);

  function handleTableRowClick(id) {
    navigate(`/board/${id}`);
  }

  if (!boardList) {
    return <Spinner />;
  }

  return (
    <Row>
      <Col>
        <h2 className="mb-4">글 목록</h2>
        {boardList.length > 0 ? (
          <Table striped hover>
            <thead>
              <tr>
                <th>#</th>
                <th>제목</th>
                <th>작성자</th>
                <th>작성일시</th>
              </tr>
            </thead>
            <tbody>
              {boardList.map((board) => (
                <tr
                  key={board.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleTableRowClick(board.id)}
                >
                  <td style={{ width: "80px" }}>{board.id}</td>
                  <td
                    style={{
                      maxWidth: "200px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {board.title}
                  </td>
                  <td
                    style={{
                      maxWidth: "100px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {board.author} {/* 필요시 authorNickName 으로 바꾸기 */}
                  </td>
                  <td style={{ width: "125px" }}>
                    {getTimesAgo(board.insertedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>
            작성된 글이 없습니다. <br />새 글을 작성해 보세요.
          </p>
        )}
      </Col>
    </Row>
  );
}
