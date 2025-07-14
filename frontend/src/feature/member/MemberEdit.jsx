import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Button,
  Col,
  FormControl,
  FormGroup,
  FormLabel,
  FormText,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthenticationContext } from "../../common/AuthenticationContextProvider.jsx";

export function MemberEdit() {
  // 상태 정의
  const [member, setMember] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [passwordModalShow, setPasswordModalShow] = useState(false);
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { logout } = useContext(AuthenticationContext);

  // 정규식
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=-]).{8,}$/;
  const nickRegex = /^[가-힣a-zA-Z0-9]{2,20}$/;

  // 최초 회원 정보 로딩
  useEffect(() => {
    axios
      .get(`/api/member?email=${params.get("email")}`)
      .then((res) => setMember(res.data))
      .catch((err) => console.error("회원 정보 로딩 실패", err));
  }, []);

  if (!member) return <Spinner />;

  // 유효성
  const isNickNameValid = nickRegex.test(member.nickName);
  const isPasswordValid = passwordRegex.test(newPassword1);
  const isPasswordMatch = newPassword1 === newPassword2;

  // 버튼 비활성화
  const isSaveDisabled = !isNickNameValid;
  const isChangePasswordDisabled =
    !oldPassword ||
    !newPassword1 ||
    !newPassword2 ||
    !isPasswordValid ||
    !isPasswordMatch;

  // 정보 수정 요청
  const handleSaveButtonClick = () => {
    axios
      .put(`/api/member`, {
        email: member.email,
        nickName: member.nickName,
        info: member.info,
        password,
      })
      .then((res) => {
        const message = res.data.message;
        if (message) toast(message.text, { type: message.type });
        navigate("/");
      })
      .catch((err) => {
        const message = err.response?.data?.message;
        if (message) toast(message.text, { type: message.type });
      })
      .finally(() => {
        setModalShow(false);
        setPassword("");
      });
  };

  // 비밀번호 변경 요청
  const handleChangePasswordButtonClick = () => {
    axios
      .put(`/api/member/changePassword`, {
        email: member.email,
        oldPassword,
        newPassword: newPassword1,
      })
      .then((res) => {
        const message = res.data.message;
        if (message) toast(message.text, { type: message.type });
        setPasswordModalShow(false);
        setOldPassword("");
        setNewPassword1("");
        setNewPassword2("");
      })
      .catch((err) => {
        const message = err.response?.data?.message;
        if (message) toast(message.text, { type: message.type });
      });
  };

  return (
    <Row className="justify-content-center">
      <Col xs={12} md={8} lg={6}>
        <h2 className="mb-4">회원 정보 수정</h2>

        <FormGroup controlId="email1" className="mb-3">
          <FormLabel>이메일</FormLabel>
          <FormControl disabled value={member.email} />
        </FormGroup>

        <div className="mb-4">
          <Button
            variant="outline-info"
            onClick={() => setPasswordModalShow(true)}
          >
            비밀번호 변경
          </Button>
        </div>

        <FormGroup controlId="nickName1" className="mb-3">
          <FormLabel>별명</FormLabel>
          <FormControl
            value={member.nickName}
            maxLength={20}
            placeholder="2~20자, 한글/영문/숫자만 사용 가능"
            onChange={(e) =>
              setMember({
                ...member,
                nickName: e.target.value.replace(/\s/g, ""),
              })
            }
          />
          {member.nickName && !isNickNameValid && (
            <FormText className="text-danger">
              별명은 2~20자, 한글/영문/숫자만 사용할 수 있습니다.
            </FormText>
          )}
        </FormGroup>

        <FormGroup controlId="info1" className="mb-3">
          <FormLabel>자기소개</FormLabel>
          <FormControl
            as="textarea"
            value={member.info}
            maxLength={3000}
            onChange={(e) => setMember({ ...member, info: e.target.value })}
          />
        </FormGroup>

        <FormGroup controlId="insertedAt1" className="mb-3">
          <FormLabel>가입일시</FormLabel>
          <FormControl
            type="datetime-local"
            disabled
            value={member.insertedAt}
          />
        </FormGroup>

        <div>
          <Button
            className="me-2"
            variant="outline-secondary"
            onClick={() => navigate(-1)}
          >
            취소
          </Button>
          <Button
            variant="primary"
            disabled={isSaveDisabled}
            onClick={() => setModalShow(true)}
          >
            저장
          </Button>
        </div>
      </Col>

      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>회원 정보 수정 확인</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup controlId="password1">
            <FormLabel>암호</FormLabel>
            <FormControl
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="현재 비밀번호를 입력하세요"
            />
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-dark" onClick={() => setModalShow(false)}>
            취소
          </Button>
          <Button variant="primary" onClick={handleSaveButtonClick}>
            저장
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={passwordModalShow}
        onHide={() => setPasswordModalShow(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>비밀번호 변경</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup className="mb-3" controlId="password2">
            <FormLabel>현재 비밀번호</FormLabel>
            <FormControl
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </FormGroup>

          <FormGroup className="mb-3" controlId="password3">
            <FormLabel>변경할 비밀번호</FormLabel>
            <FormControl
              type="password"
              value={newPassword1}
              maxLength={255}
              placeholder="8자 이상, 영문 대/소문자, 숫자, 특수문자 포함"
              onChange={(e) => setNewPassword1(e.target.value)}
            />
            {newPassword1 && !isPasswordValid && (
              <FormText className="text-danger">
                비밀번호는 8자 이상, 영문 대소문자, 숫자, 특수문자를 포함해야
                합니다.
              </FormText>
            )}
          </FormGroup>

          <FormGroup className="mb-3" controlId="password4">
            <FormLabel>변경할 비밀번호 확인</FormLabel>
            <FormControl
              type="password"
              value={newPassword2}
              maxLength={255}
              placeholder="변경할 비밀번호를 다시 입력하세요"
              onChange={(e) => setNewPassword2(e.target.value)}
            />
            {newPassword2 && !isPasswordMatch && (
              <FormText className="text-danger">
                비밀번호가 일치하지 않습니다.
              </FormText>
            )}
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-dark"
            onClick={() => setPasswordModalShow(false)}
          >
            취소
          </Button>
          <Button
            variant="primary"
            onClick={handleChangePasswordButtonClick}
            disabled={isChangePasswordDisabled}
          >
            변경
          </Button>
        </Modal.Footer>
      </Modal>
    </Row>
  );
}
