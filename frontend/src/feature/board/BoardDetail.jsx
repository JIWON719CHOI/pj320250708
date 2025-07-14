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

export function BoardDetail() {
  const [board, setBoard] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const { hasAccess, user } = useContext(AuthenticationContext); // user도 같이 받아오기
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/board/${id}`)
      .then((res) => {
        setBoard(res.data);
      })
      .catch(() => {
        toast("해당 게시물이 없습니다.", { type: "warning" });
      });
  }, [id]);

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
        toast("게시물이 삭제되지 않았습니다.", { type: "warning" });
      });
  }

  if (!board) {
    return <Spinner />;
  }

  const formattedInsertedAt = board.insertedAt
    ? board.insertedAt.substring(0, 16)
    : "";

  // 디버깅용 로그
  console.log("user email:", user?.email);
  console.log("board author email:", board.authorEmail);
  console.log("hasAccess result:", hasAccess(board.authorEmail));

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
