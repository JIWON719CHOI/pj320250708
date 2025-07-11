import { Link, NavLink } from "react-router";
import { Container, Nav, Navbar } from "react-bootstrap";

export function AppNavBar() {
  return (
    <div>
      <Navbar expand="lg" className="bg-body-tertiary" fixed="top">
        <Container className="flex-grow-1">
          <Navbar.Brand to="/" as={Link} className="fs-3 fw-bold">
            PRJ3
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to="/board/list">
                게시판
              </Nav.Link>
              <Nav.Link as={NavLink} to="/board/add">
                작성
              </Nav.Link>
              <Nav.Link as={NavLink} to="/member/list">
                목록
              </Nav.Link>
              <Nav.Link as={NavLink} to="/signup">
                가입
              </Nav.Link>
              <Nav.Link as={NavLink} to="/login">
                로그인
              </Nav.Link>
              <Nav.Link as={NavLink} to="/logout">
                로그아웃
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}
