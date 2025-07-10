import { Link, NavLink } from "react-router";
import { Container, Nav, Navbar } from "react-bootstrap";

export function AppNavBar() {
  return (
    <div>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand to="/" as={Link}>
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
              <Nav.Link as={NavLink} to="/signup">
                가입
              </Nav.Link>
              <Nav.Link as={NavLink} to="/member/list">
                목록
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}
