import { Col, Row, Spinner, Table, Alert, Pagination } from "react-bootstrap";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router";
import { AuthenticationContext } from "../../common/AuthenticationContextProvider.jsx"; // 경로는 상황에 맞게

export function BoardList() {
  const [boardList, setBoardList] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [pageInfo, setPageInfo] = useState(null);
  const keyword = searchParams.get("q") ?? "";
  const navigate = useNavigate();

  const { user } = useContext(AuthenticationContext);

  useEffect(() => {
    if (!user) {
      setErrorMsg("로그인이 필요합니다.");
      setBoardList(null); // 에러 발생 시 리스트 초기화
      return;
    }

    axios
      .get("/api/board/list", { params: { q: keyword } })
      .then((res) => {
        setBoardList(res.data.boardList);
        setPageInfo(res.data.pageInfo);
        setErrorMsg("");
      })
      .catch((err) => {
        setBoardList(null); // 에러 발생 시 리스트 초기화
        if (err.response?.status === 401) {
          setErrorMsg("권한이 없습니다. 로그인 후 다시 시도하세요.");
        } else {
          setErrorMsg("게시글을 불러오는 중 오류가 발생했습니다.");
        }
      });
  }, [searchParams]);

  function handleTableRowClick(id) {
    navigate(`/board/${id}`);
  }

  if (errorMsg) {
    return (
      <Row>
        <Col>
          <Alert variant="danger" className="mt-4">
            {errorMsg}
          </Alert>
        </Col>
      </Row>
    );
  }

  if (!boardList) {
    return (
      <Row>
        <Col className="text-center mt-4">
          <Spinner animation="border" />
        </Col>
      </Row>
    );
  }

  const pageNumbers = [];
  for (let i = pageInfo.leftPageNumber; i <= pageInfo.rightPageNumber; i++) {
    pageNumbers.push(i);
  }

  function handlePageNumberClick(pageNumber) {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("p", pageNumber);
    setSearchParams(nextSearchParams);
  }

  return (
    <>
      <Row>
        <Col>
          <h2 className="mb-4">글 목록</h2>
          {boardList.length > 0 ? (
            <Table striped hover>
              <thead>
                <tr>
                  <th style={{ width: "80px" }}>#</th>
                  <th>제목</th>
                  <th style={{ maxWidth: "100px" }}>작성자</th>
                  <th style={{ width: "125px" }}>작성일시</th>
                </tr>
              </thead>
              <tbody>
                {boardList.map((board) => (
                  <tr
                    key={board.id}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleTableRowClick(board.id)}
                  >
                    <td>{board.id}</td>
                    <td
                      style={{
                        maxWidth: "200px",
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
                        maxWidth: "100px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      title={board.nickName}
                    >
                      {board.nickName}
                    </td>
                    <td style={{ width: "125px" }}>{board.timesAgo}</td>
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
      <Row className="my-3">
        <Col>
          <Pagination>
            {pageNumbers.map((pageNumber) => (
              <Pagination.Item
                key={pageNumber}
                onClick={() => handlePageNumberClick(pageNumber)}
              >
                {pageNumber}
              </Pagination.Item>
            ))}
          </Pagination>
        </Col>
      </Row>
    </>
  );
}
