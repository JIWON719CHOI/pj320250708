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
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "react-toastify";
import { AuthenticationContext } from "../../common/AuthenticationContextProvider.jsx";

export function MemberDetail() {
  const [member, setMember] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [password, setPassword] = useState("");
  const { logout, hasAccess } = useContext(AuthenticationContext);
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/member?email=${params.get("email")}`)
      .then((res) => {
        setMember(res.data);
      })
      .catch((err) => {
        console.log("bad", err);
      });
  }, [params]);

  function handleDeleteButtonClick() {
    axios
      .delete("/api/member", {
        data: { email: member.email, password: password },
      })
      .then((res) => {
        toast(res.data.message.text, { type: res.data.message.type });
        navigate("/");
        logout();
      })
      .catch((err) => {
        toast(err.response.data.message.text, { type: "danger" });
      })
      .finally(() => {
        setModalShow(false);
        setPassword("");
      });
  }

  function handleLogoutClick() {
    logout();
    navigate("/");
  }

  if (!member) {
    return <Spinner />;
  }

  return (
    <Row className="justify-content-center">
      <Col xs={12} md={8} lg={6}>
        <h2 className="mb-4">회원 정보</h2>

        {/* 회원 정보 폼들 */}
        <FormGroup controlId="email1" className="mb-3">
          <FormLabel>이메일</FormLabel>
          <FormControl readOnly value={member.email} />
        </FormGroup>

        <FormGroup controlId="nickName1" className="mb-3">
          <FormLabel>별명</FormLabel>
          <FormControl readOnly value={member.nickName} />
        </FormGroup>

        <FormGroup controlId="info1" className="mb-3">
          <FormLabel>자기소개</FormLabel>
          <FormControl as="textarea" readOnly value={member.info} />
        </FormGroup>

        <FormGroup controlId="inserted1" className="mb-3">
          <FormLabel>가입일시</FormLabel>
          <FormControl
            type="datetime-local"
            readOnly
            value={member.insertedAt}
          />
        </FormGroup>

        {hasAccess(member.email) && (
          <div>
            <Button
              variant="outline-danger"
              className="me-2"
              onClick={() => setModalShow(true)}
            >
              탈퇴
            </Button>
            <Button
              variant="outline-info"
              className="me-2"
              onClick={() => navigate(`/member/edit?email=${member.email}`)}
            >
              수정
            </Button>

            {/* 새로 추가하는 로그아웃 버튼 */}
            <Button ariant="outline-secondary" onClick={handleLogoutClick}>
              로그아웃
            </Button>
          </div>
        )}
      </Col>

      {/* 탈퇴 확인 모달 */}
      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>회원 탈퇴 확인</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup controlId="password1">
            <FormLabel>암호</FormLabel>
            <FormControl
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-dark" onClick={() => setModalShow(false)}>
            취소
          </Button>
          <Button variant="danger" onClick={handleDeleteButtonClick}>
            탈퇴
          </Button>
        </Modal.Footer>
      </Modal>
    </Row>
  );
}
