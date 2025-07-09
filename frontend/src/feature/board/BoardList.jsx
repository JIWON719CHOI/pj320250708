import { Col, Row, Spinner, Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";

export function BoardList() {
  const [boardList, setBoardList] = useState(null);

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

  if (!boardList) {
    return <Spinner />;
  }

  return (
    <Row>
      <Col>
        <h2 className="mb-4">글 목록</h2>
        {boardList.length > 0 ? (
          <Table striped={true} hover={true}>
            <colgroup>
              <col style={{ width: "60px" }} />
              <col style={{}} />
              <col style={{ width: "125px" }} />
              <col style={{ width: "100px" }} />
            </colgroup>
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
                <tr key={board.id}>
                  <td>{board.id}</td>
                  <td>{board.title}</td>
                  <td>{board.author}</td>
                  <td>{board.timesAgo}</td>
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
