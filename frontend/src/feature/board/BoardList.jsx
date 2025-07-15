import {
  Col,
  Row,
  Spinner,
  Table,
  Alert,
  Pagination,
  Form,
  InputGroup,
  FormControl,
  Button,
} from "react-bootstrap";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router";
import { AuthenticationContext } from "../../common/AuthenticationContextProvider.jsx";

export function BoardList() {
  const [boardList, setBoardList] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [pageInfo, setPageInfo] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthenticationContext);

  // query 상태는 URL 에서 직접 추출
  const keyword = searchParams.get("q") ?? "";
  const page = searchParams.get("p") ?? "1";

  useEffect(() => {
    if (!user) {
      setErrorMsg("로그인이 필요합니다.");
      setBoardList(null);
      return;
    }

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
  }, [user, keyword, page]);

  function handleSearchFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const input = form.querySelector("input");
    const newKeyword = input.value.trim();
    setSearchParams({ q: newKeyword, p: 1 }); // 검색하면 항상 1페이지로
  }

  function handlePageNumberClick(pageNumber) {
    const next = new URLSearchParams(searchParams);
    next.set("p", pageNumber);
    setSearchParams(next);
  }

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
                onClick={() => handlePageNumberClick(pageNumber)}
                active={pageInfo.currentPageNumber === pageNumber}
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
            className="mx-auto"
            style={{ maxWidth: "500px" }}
          >
            <InputGroup>
              <FormControl
                name="q"
                placeholder="(제목+내용)"
                defaultValue={keyword}
              />
              <Button type="submit">검색</Button>
            </InputGroup>
          </Form>
        </Col>
      </Row>
    </>
  );
}
