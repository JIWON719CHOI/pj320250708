import { Link, NavLink } from "react-router";
import { Container, Nav, Navbar } from "react-bootstrap";
import { useContext } from "react";
import { AuthenticationContext } from "./AuthenticationContextProvider.jsx";

export function AppNavBar() {
  const { user, isAdmin } = useContext(AuthenticationContext);

  return (
    <Navbar expand="lg" bg="light" fixed="top" className="bg-body-tertiary">
      <Container className="d-flex align-items-center">
        {/* 1. 브랜드 (왼쪽 끝) */}
        <Navbar.Brand as={Link} to="/" className="fs-3 fw-bold">
          PRJ3
        </Navbar.Brand>

        {/* 2. 메뉴 (Collapse 안) */}
        <Navbar.Collapse id="main-nav">
          <Nav>
            <Nav.Link as={NavLink} to="/board/list">
              게시판 목록
            </Nav.Link>
            {user && (
              <Nav.Link as={NavLink} to="/board/add">
                게시글 작성
              </Nav.Link>
            )}
            {isAdmin() && (
              <Nav.Link as={NavLink} to="/member/list">
                회원 목록
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>

        {/* 3. 로그인/닉네임 + 햄버거 토글 묶음 (오른쪽 끝에 고정) */}
        <div className="d-flex align-items-center ms-auto">
          <Nav className="me-3">
            {!user ? (
              <Nav.Link as={NavLink} to="/login">
                로그인
              </Nav.Link>
            ) : (
              <Nav.Link as={NavLink} to={`/member?email=${user.email}`}>
                {user.nickName}
              </Nav.Link>
            )}
          </Nav>

          <Navbar.Toggle aria-controls="main-nav" />
        </div>
      </Container>
    </Navbar>
  );
}
