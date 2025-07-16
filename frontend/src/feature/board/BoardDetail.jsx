import { useNavigate, useParams } from "react-router";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  Col,
  FormControl,
  FormGroup,
  FormLabel,
  ListGroup,
  ListGroupItem,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";
import { AuthenticationContext } from "../../common/AuthenticationContextProvider.jsx";
import { CommentContainer } from "../comment/CommentContainer.jsx";
import { LikeContainer } from "../like/LikeContainer.jsx";

// ... 생략된 import 및 useState, useEffect 등 동일

export function BoardDetail() {
  const [board, setBoard] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const { hasAccess } = useContext(AuthenticationContext);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/board/${id}`)
      .then((res) => {
        setBoard(res.data);
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          toast.warning("해당 게시물이 없습니다.");
          navigate("/");
        } else {
          toast.error("게시글을 불러오는 중 오류가 발생했습니다.");
        }
      });
  }, [id, navigate]);

  function handleDeleteButtonClick() {
    axios
      .delete(`/api/board/${id}`)
      .then((res) => {
        const message = res.data.message;
        if (message) {
          toast(message.text, { type: message.type });
        }
        navigate("/");
      })
      .catch(() => {
        toast.warning("게시물이 삭제되지 않았습니다.");
      });
  }

  if (!board) {
    return <Spinner />;
  }

  const formattedInsertedAt = board.insertedAt
    ? board.insertedAt.substring(0, 16)
    : "";

  return (
    <Row className="justify-content-center">
      <Col xs={12} md={8} lg={6}>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h4 className="mb-0 fw-bold">{board.title}</h4>
          <span className="text-muted" style={{ fontSize: "0.9rem" }}>
            {board.id}번 게시물
          </span>
        </div>

        <Card className="mb-3 shadow-sm">
          <Card.Body>
            <Card.Text
              className="mb-4 text-secondary"
              style={{
                whiteSpace: "pre-wrap",
                minHeight: "100px",
                fontSize: "1rem",
              }}
            >
              {board.content}
            </Card.Text>

            {/* 이미지 미리보기 */}
            {Array.isArray(board.files) &&
              board.files.some((file) =>
                /\.(jpg|jpeg|png|gif|webp)$/i.test(file),
              ) && (
                <div className="mb-3 d-flex flex-column gap-2">
                  {board.files
                    .filter((file) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
                    .map((file, idx) => (
                      <img
                        key={idx}
                        src={file}
                        alt={`첨부 이미지 ${idx + 1}`}
                        style={{ maxWidth: "100%", borderRadius: "8px" }}
                      />
                    ))}
                </div>
              )}

            {/* 첨부 파일 목록 */}
            {Array.isArray(board.files) && board.files.length > 0 && (
              <div className="mb-3">
                <strong className="d-block mb-2">첨부 파일</strong>
                <ListGroup>
                  {board.files.map((file, idx) => (
                    <ListGroupItem
                      key={idx}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <span
                        className="text-truncate"
                        style={{ maxWidth: "80%" }}
                      >
                        {file.split("/").pop()}
                      </span>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        href={file}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        다운로드
                      </Button>
                    </ListGroupItem>
                  ))}
                </ListGroup>
              </div>
            )}

            {/* 작성자 / 작성일시 */}
            <Row className="text-muted mb-3" style={{ fontSize: "0.9rem" }}>
              <Col xs={6}>
                <div>
                  <strong>작성자</strong>
                  <div>{board.authorNickName}</div>
                </div>
              </Col>
              <Col xs={6}>
                <div>
                  <strong>작성일시</strong>
                  <div>{formattedInsertedAt}</div>
                </div>
              </Col>
            </Row>

            {/* 버튼 및 좋아요 */}
            <div className="d-flex justify-content-between align-items-center">
              <div>
                {hasAccess(board.authorEmail) && (
                  <>
                    <Button
                      onClick={() => setModalShow(true)}
                      className="me-2"
                      variant="outline-danger"
                      size="sm"
                    >
                      삭제
                    </Button>
                    <Button
                      variant="outline-info"
                      size="sm"
                      onClick={() => navigate(`/board/edit?id=${board.id}`)}
                    >
                      수정
                    </Button>
                  </>
                )}
              </div>
              <LikeContainer boardId={board.id} />
            </div>
          </Card.Body>
        </Card>

        <CommentContainer boardId={board.id} />
      </Col>

      <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>게시물 삭제 확인</Modal.Title>
        </Modal.Header>
        <Modal.Body>{board.id}번 게시물을 삭제하시겠습니까?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setModalShow(false)}
          >
            취소
          </Button>
          <Button variant="danger" onClick={handleDeleteButtonClick}>
            삭제
          </Button>
        </Modal.Footer>
      </Modal>
    </Row>
  );
}
