import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
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

export function BoardDetail() {
  const [board, setBoard] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [modalShow, setModalShow] = useState(false);

  // 현재 로그인한 사용자 이메일 가져오기 (예시)
  function getEmailFromToken() {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.sub || payload.email;
    } catch {
      return null;
    }
  }

  const userEmail = getEmailFromToken();

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

  if (!board) {
    return <Spinner />;
  }

  function hasAccess(email) {
    return userEmail === email;
  }

  function handleDeleteButtonClick() {
    axios
      .delete(`/api/board/${id}`)
      .then((res) => {
        const message = res.data.message;
        if (message) {
          toast(message.text, { type: message.type });
        }
        navigate("/board/list");
      })
      .catch(() => {
        toast("게시물이 삭제되지 않았습니다.", { type: "warning" });
      });
  }

  const formattedInsertedAt = board.insertedAt
    ? new Date(board.insertedAt).toLocaleString()
    : "";

  return (
    <>
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <h2 className="mb-4">{board.id}번 게시물</h2>
          <FormGroup className="mb-3" controlId="title1">
            <FormLabel>제목</FormLabel>
            <FormControl readOnly value={board.title} />
          </FormGroup>
          <FormGroup className="mb-3" controlId="content1">
            <FormLabel>본문</FormLabel>
            <FormControl
              as="textarea"
              rows={6}
              readOnly
              value={board.content}
            />
          </FormGroup>
          <FormGroup className="mb-3" controlId="author1">
            <FormLabel>작성자</FormLabel>
            <FormControl readOnly value={board.authorNickName} />
          </FormGroup>
          <FormGroup className="mb-3" controlId="insertedAt1">
            <FormLabel>작성일시</FormLabel>
            <FormControl type="text" readOnly value={formattedInsertedAt} />
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
      </Row>

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
    </>
  );
}
