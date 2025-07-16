import {
  Alert,
  Badge,
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
import { FaRegComments, FaThumbsUp } from "react-icons/fa";

export function BoardList() {
  const [boardList, setBoardList] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [pageInfo, setPageInfo] = useState(null);
  const keyword = searchParams.get("q") ?? "";
  const navigate = useNavigate();
  const [keywords, setKeywords] = useState("");

  useEffect(() => {
    setKeywords(searchParams.get("q") ?? "");
  }, [searchParams]);

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
        setErrorMsg(
          err.response?.status === 401
            ? "권한이 없습니다. 로그인 후 다시 시도하세요."
            : "게시글을 불러오는 중 오류가 발생했습니다.",
        );
      });
  }, [keyword, searchParams]);

  function handleSearchFormSubmit(e) {
    e.preventDefault();
    navigate("/board/list?q=" + encodeURIComponent(keywords));
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
  if (pageInfo) {
    for (let i = pageInfo.leftPageNumber; i <= pageInfo.rightPageNumber; i++) {
      pageNumbers.push(i);
    }
  }

  function handlePageNumberClick(pageNumber) {
    const next = new URLSearchParams(searchParams);
    next.set("p", pageNumber);
    setSearchParams(next);
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
                  <th style={{ width: "45px" }}>#</th>
                  <th style={{ width: "45px" }}>
                    <FaThumbsUp
                      size={14}
                      className="text-secondary text-black"
                    />
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
                    onClick={() => handleTableRowClick(board.id)}
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
        <Row className="my-3 justify-content-center mx-0">
          <Col
            xs="auto"
            className="mx-auto"
            style={{ maxWidth: "500px", width: "100%" }}
          >
            <Pagination className="justify-content-center mb-3 d-flex">
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
              {pageNumbers.map((num) => (
                <Pagination.Item
                  key={num}
                  active={pageInfo.currentPageNumber === num}
                  onClick={() => handlePageNumberClick(num)}
                >
                  {num}
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

            <Form onSubmit={handleSearchFormSubmit} className="d-flex">
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
