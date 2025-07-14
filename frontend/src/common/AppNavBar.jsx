import { Link, NavLink } from "react-router";
import { Container, Nav, Navbar } from "react-bootstrap";
import { useContext } from "react";
import { AuthenticationContext } from "./AuthenticationContextProvider.jsx";

export function AppNavBar() {
  const { user, isAdmin } = useContext(AuthenticationContext);

  return (
    <Navbar expand="lg" bg="light" fixed="top" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fs-3 fw-bold">
          PRJ3
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/board/list">
              게시판
            </Nav.Link>

            {user && (
              <Nav.Link as={NavLink} to="/board/add">
                작성
              </Nav.Link>
            )}

            {isAdmin() && (
              <Nav.Link as={NavLink} to="/member/list">
                목록
              </Nav.Link>
            )}
          </Nav>

          <Nav>
            {/* 로그인 안 된 경우 로그인 링크 항상 노출 */}
            {!user && (
              <Nav.Link as={NavLink} to="/login">
                로그인
              </Nav.Link>
            )}

            {/* 로그인 된 경우 닉네임만 노출, 클릭 시 멤버 디테일 페이지로 이동 */}
            {user && (
              <Nav.Link as={NavLink} to={`/member?email=${user.email}`}>
                {user.nickName}
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
