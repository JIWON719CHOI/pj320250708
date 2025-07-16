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
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "react-toastify";

export function BoardEdit() {
  const [board, setBoard] = useState(null);
  const [searchParams] = useSearchParams();
  const [modalShow, setModalShow] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const id = searchParams.get("id");
    if (!id) {
      toast("잘못된 접근입니다.", { type: "warning" });
      navigate("/board/list");
      return;
    }

    axios
      .get(`/api/board/${id}`)
      .then((res) => {
        setBoard(res.data);
      })
      .catch((err) => {
        toast("해당 게시물이 존재하지 않습니다.", { type: "warning" });
        navigate("/board/list");
      });
  }, [searchParams, navigate]);

  function handleSaveButtonClick() {
    if (!board) return;

    setIsProcessing(true);
    const id = searchParams.get("id");

    axios
      .put(`/api/board/${id}`, board)
      .then((res) => {
        const message = res.data.message || {
          text: "게시물이 성공적으로 수정되었습니다.",
          type: "success",
        };
        toast(message.text, { type: message.type });
        navigate(`/board/${board.id}`);
      })
      .catch((err) => {
        const message = err.response?.data?.message || {
          text: "게시물 수정 중 오류가 발생했습니다.",
          type: "warning",
        };
        toast(message.text, { type: message.type });
      })
      .finally(() => {
        setModalShow(false);
        setIsProcessing(false);
      });
  }

  if (!board) {
    return (
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6} className="text-center my-5">
          <Spinner animation="border" />
        </Col>
      </Row>
    );
  }

  // 유효성 검사: 제목, 본문, 작성자 닉네임 모두 빈문자열 아니어야 함
  const isValid =
    (board.title?.trim() ?? "") !== "" &&
    (board.content?.trim() ?? "") !== "" &&
    (board.authorNickName?.trim() ?? "") !== "";

  return (
    <Row className="justify-content-center">
      <Col xs={12} md={8} lg={6}>
        <h4 className="mb-4" style={{ fontWeight: "600" }}>
          {board.id}번 게시물 수정
        </h4>

        <FormGroup className="mb-3" controlId="title1">
          <FormLabel>제목</FormLabel>
          <FormControl
            value={board.title}
            onChange={(e) => setBoard({ ...board, title: e.target.value })}
            placeholder="제목을 입력하세요"
          />
        </FormGroup>

        <FormGroup className="mb-3" controlId="content1">
          <FormLabel>본문</FormLabel>
          <FormControl
            as="textarea"
            rows={6}
            value={board.content}
            onChange={(e) => setBoard({ ...board, content: e.target.value })}
            placeholder="본문을 입력하세요"
          />
        </FormGroup>

        <FormGroup className="mb-3" controlId="author1">
          <FormLabel>작성자</FormLabel>
          <FormControl value={board.authorNickName || ""} disabled />
        </FormGroup>

        <div>
          <Button
            className="me-2"
            onClick={() => navigate(-1)}
            variant="outline-secondary"
            disabled={isProcessing}
          >
            취소
          </Button>
          <Button
            disabled={!isValid || isProcessing}
            onClick={() => setModalShow(true)}
            variant="primary"
          >
            {isProcessing && <Spinner size="sm" className="me-2" />}
            {isProcessing ? "저장 중..." : "저장"}
          </Button>
        </div>
      </Col>

      <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>게시물 저장 확인</Modal.Title>
        </Modal.Header>
        <Modal.Body>{board.id}번 게시물을 수정하시겠습니까?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-dark"
            onClick={() => setModalShow(false)}
            disabled={isProcessing}
          >
            취소
          </Button>
          <Button
            disabled={isProcessing}
            variant="primary"
            onClick={handleSaveButtonClick}
          >
            {isProcessing && <Spinner size="sm" className="me-2" />}
            {isProcessing ? "저장 중..." : "저장"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Row>
  );
}
