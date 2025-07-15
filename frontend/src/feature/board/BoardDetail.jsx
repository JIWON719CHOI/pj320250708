import { useNavigate, useParams } from "react-router";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Button,
  Col,
  FormControl,
  FormGroup,
  FormLabel,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";
import { AuthenticationContext } from "../../common/AuthenticationContextProvider.jsx";
import { CommentContainer } from "../comment/CommentContainer.jsx";

export function BoardDetail() {
  const [board, setBoard] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const { hasAccess } = useContext(AuthenticationContext);
  const { id } = useParams();
  const navigate = useNavigate();

  // 게시글 불러오기
  useEffect(() => {
    axios
      .get(`/api/board/${id}`)
      .then((res) => {
        setBoard(res.data);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          toast.warning("로그인이 필요합니다.");
          navigate("/login");
        } else {
          toast.warning("해당 게시물이 없습니다.");
        }
      });
  }, [id, navigate]);

  // 게시글 삭제
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
      }, []);
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
        <h2 className="mb-4">{board.id}번 게시물</h2>

        <FormGroup className="mb-3" controlId="title1">
          <FormLabel>제목</FormLabel>
          <FormControl readOnly value={board.title} />
        </FormGroup>

        <FormGroup className="mb-3" controlId="content1">
          <FormLabel>본문</FormLabel>
          <FormControl as="textarea" rows={6} readOnly value={board.content} />
        </FormGroup>

        <FormGroup className="mb-3" controlId="author1">
          <FormLabel>작성자</FormLabel>
          <FormControl readOnly value={board.authorNickName} />
        </FormGroup>

        <FormGroup className="mb-3" controlId="insertedAt1">
          <FormLabel>작성일시</FormLabel>
          <FormControl
            type="datetime-local"
            readOnly
            value={formattedInsertedAt}
          />
        </FormGroup>

        {hasAccess(board.authorEmail) && (
          <div>
            <Button
              onClick={() => setModalShow(true)}
              className="me-2"
              variant="outline-danger"
            >
              삭제
            </Button>
            <Button
              variant="outline-info"
              onClick={() => navigate(`/board/edit?id=${board.id}`)}
            >
              수정
            </Button>
          </div>
        )}
        <br />
        {/* 댓글 목록 + 입력 컴포넌트 */}
        <CommentContainer boardId={board.id} />
      </Col>

      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>게시물 삭제 확인</Modal.Title>
        </Modal.Header>
        <Modal.Body>{board.id}번 게시물을 삭제하시겠습니까?</Modal.Body>
        <Modal.Footer>
          <Button variant="outline-dark" onClick={() => setModalShow(false)}>
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
