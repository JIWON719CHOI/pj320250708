import {
  Alert,
  Button,
  Col,
  Form,
  FormControl,
  InputGroup,
  Pagination,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router";

export function BoardList() {
  const [boardList, setBoardList] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [pageInfo, setPageInfo] = useState(null);
  const keyword = searchParams.get("q") ?? "";
  const navigate = useNavigate();
  const [keywords, setKeywords] = useState("");

  // 검색어가 URL 쿼리 파라미터 변경에 따라 동기화
  useEffect(() => {
    const q = searchParams.get("q");
    setKeywords(q ?? "");
  }, [searchParams]);

  // 게시판 목록 불러오기 (로그인 여부와 무관)
  useEffect(() => {
    const page = searchParams.get("p") ?? "1";

    axios
      .get("/api/board/list", { params: { q: keyword, p: page } })
      .then((res) => {
        setBoardList(res.data.boardList);
        setPageInfo(res.data.pageInfo);
        setErrorMsg("");
      })
      .catch((err) => {
        setBoardList(null);
        if (err.response?.status === 401) {
          setErrorMsg("권한이 없습니다. 로그인 후 다시 시도하세요.");
        } else {
          setErrorMsg("게시글을 불러오는 중 오류가 발생했습니다.");
        }
      });
  }, [keyword, searchParams]);

  // 검색 폼 제출
  function handleSearchFormSubmit(e) {
    e.preventDefault();
    navigate("/board/list?q=" + encodeURIComponent(keywords));
  }

  // 게시글 클릭 시 상세페이지로 이동
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

  // 페이지 번호 배열 생성
  const pageNumbers = [];
  if (pageInfo) {
    for (let i = pageInfo.leftPageNumber; i <= pageInfo.rightPageNumber; i++) {
      pageNumbers.push(i);
    }
  }

  // 페이지 이동 처리
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
            <Table
              striped
              hover
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
                {boardList.map((board) => (
                  <tr
                    key={board.id}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleTableRowClick(board.id)}
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
                      {board.title}{" "}
                      {board.countComment > 0 && (
                        <span
                          className="badge bg-secondary ms-1"
                          style={{ fontSize: "0.75em" }}
                        >
                          {board.countComment}
                        </span>
                      )}
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

      {pageInfo && (
        <Row className="my-3">
          <Col>
            <Pagination className="justify-content-center">
              <Pagination.First
                disabled={pageInfo.currentPageNumber === 1}
                onClick={() => handlePageNumberClick(1)}
              />
              <Pagination.Prev
                disabled={pageInfo.leftPageNumber <= 1}
                onClick={() =>
                  handlePageNumberClick(pageInfo.leftPageNumber - 10)
                }
              />
              {pageNumbers.map((pageNumber) => (
                <Pagination.Item
                  key={pageNumber}
                  active={pageInfo.currentPageNumber === pageNumber}
                  onClick={() => handlePageNumberClick(pageNumber)}
                >
                  {pageNumber}
                </Pagination.Item>
              ))}
              <Pagination.Next
                disabled={pageInfo.rightPageNumber >= pageInfo.totalPages}
                onClick={() =>
                  handlePageNumberClick(pageInfo.rightPageNumber + 1)
                }
              />
              <Pagination.Last
                disabled={pageInfo.currentPageNumber === pageInfo.totalPages}
                onClick={() => handlePageNumberClick(pageInfo.totalPages)}
              />
            </Pagination>
            <Form
              onSubmit={handleSearchFormSubmit}
              className="order-lg-2 mx-lg-auto justify-content-center"
              style={{ maxWidth: "500px" }}
            >
              <InputGroup style={{ width: "100%" }}>
                <FormControl
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="(제목+내용)"
                />
                <Button type="submit">검색</Button>
              </InputGroup>
            </Form>
          </Col>
        </Row>
      )}
    </>
  );
}
