import { Col, Row, Spinner, Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

export function BoardList() {
  const [boardList, setBoardList] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 마운트될때(initial render 시) 실행되는 코드
    axios
      .get("/api/board/list")
      .then((res) => {
        console.log("잘 될 때 코드");
        setBoardList(res.data);
      })
      .catch((err) => {
        console.log("잘 안될 때 코드");
      })
      .finally(() => {
        console.log("항상 실행 코드");
      });
  }, []);

  function handleTableRowClick(id) {
    // 게시물 보기로 이동
    navigate(`/board/${id}`);
  }

  // 아직 게시물 없으면 스피너 돌리기
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
                    {board.author}
                  </td>
                  <td style={{ width: "200px" }}>{board.timesAgo}</td>
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
